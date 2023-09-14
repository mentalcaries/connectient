'use server';
import supabase from '@/db/supabase';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { transporter, mailOptions } from '@/config/nodemailer';
import {
  generateConfirmationEmailContent,
  generateEmailContent,
} from '@/config/emailContent';
import { PostgrestError } from '@supabase/supabase-js';
import ConfirmationEmailData from '@/types/ConfirmationEmailData';

export const loginFormAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return data;
};

export const createAppointmentFormAction = async (
  appointmentData: Appointment,
): Promise<Appointment> => {
  try {
    const { error }: { error: PostgrestError | null } = await supabase
      .from('Appointments')
      .insert([appointmentData]);

    if (error || !appointmentData) {
      throw new Error('Failed to create appointment');
    }
    return appointmentData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to create appointment:', error.message);
    } else {
      console.error('Failed to create appointment:', error);
    }
    throw new Error('Failed to create appointment');
  }
};

export const emailHandler = async (appointmentData: Appointment) => {
  try {
    const practice = await getPractice(appointmentData.practice_id);

    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(appointmentData, practice[0]),
    });
    return appointmentData;
  } catch (error) {
    throw new Error('Failed to send request email.');
  }
};

export const emailConfirmationHandler = async (
  appointmentData: ConfirmationEmailData,
) => {
  try {
    const practice = await getPractice(appointmentData.practice_id);
    await transporter.sendMail({
      ...mailOptions,
      ...generateConfirmationEmailContent(appointmentData, practice[0]),
    });
    return appointmentData;
  } catch (error) {
    throw new Error('Failed to send request email.');
  }
};

export const getAppointment = async (appointmentId: string | undefined) => {
  const supabase = createServerActionClient<Database>({ cookies });
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .select(
        'first_name, last_name, email, appointment_type, scheduled_date, scheduled_time',
      )
      .eq('id', appointmentId);
    if (error) {
      throw new Error('Failed to find appointment.');
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getPractice = async (practiceId: string | null | undefined) => {
  const supabase = createServerActionClient<Database>({ cookies });
  try {
    const { data, error } = await supabase
      .from('Practice')
      .select('name, city, phone, email, logo, website, street_address')
      .eq('id', practiceId);
    if (error) {
      throw new Error('Failed to find practice.');
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const cancelAppointment = async (appointmentId: string) => {
  const supabase = createServerActionClient<Database>({ cookies });
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .update({ is_cancelled: true })
      .eq('id', appointmentId)
      .select();

    if (error) {
      throw new Error('Failed to cancel appointment schedule.');
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const scheduleAppointment = async (
  appointmentId: string,
  scheduledDate: string,
  scheduledTime: string,
) => {
  const supabase = createServerActionClient<Database>({ cookies });
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .update({
        is_scheduled: true,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
      })
      .eq('id', appointmentId)
      .select();

    if (error) {
      throw new Error('Failed to schedule appointment schedule.');
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};
