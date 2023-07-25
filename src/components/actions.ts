'use server';
import supabase from '@/db/supabase';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type LoginFormData from '@/types/LoginFormData';
import { transporter, mailOptions } from '@/config/nodemailer';
import {
  generateConfirmationEmailContent,
  generateEmailContent,
} from '@/config/emailContent';
import { PostgrestError } from '@supabase/supabase-js';
import ConfirmationEmailData from '@/types/ConfirmationEmailData';

export const loginFormAction = (data: LoginFormData): void => {
  console.log(
    `User Name: ${data.userName} | User Password: ${data.userPassword}`,
  );
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
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(appointmentData),
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
    await transporter.sendMail({
      ...mailOptions,
      ...generateConfirmationEmailContent(appointmentData),
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
        'first_name, last_name, appointment_type, scheduled_date, scheduled_time',
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

export const updateAppointment = async (
  appointmentId: string,
  isScheduled: boolean,
) => {
  const supabase = createServerActionClient<Database>({ cookies });
  try {
    const { error }: { error: PostgrestError | null } = await supabase
      .from('Appointments')
      .update({ is_scheduled: isScheduled })
      .eq('id', appointmentId);

    if (error) {
      throw new Error('Failed to update appointment schedule.');
    }
  } catch (error) {
    console.error(error);
  }
};
