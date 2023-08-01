type ConfirmationEmailData = {
  first_name: string;
  last_name: string;
  appointment_type: string | null;
  scheduled_date: string | null | undefined;
  scheduled_time: string | null | undefined;
};

export default ConfirmationEmailData;