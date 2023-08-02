'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAppointmentFormAction } from './actions';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import 'react-phone-number-input/style.css';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// <-- UI -->
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  format,
  isPast,
  isSunday,
  addMonths,
  addBusinessDays,
  startOfTomorrow,
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';

import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from './ui/toast';
import AppointmentPreview from './AppointmentPreview';

const formSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First name should be at least 2 characters' }),
  last_name: z
    .string()
    .min(2, { message: 'Last name should be at least 2 characters' }),
  mobile_phone: z
    .string({ required_error: 'Phone number is required' })
    .min(10, { message: 'Phone number is too short' }),
  email: z.string().email(),
  requested_date: z.date({ required_error: 'A date is required' }),
  requested_time: z.string(),
  appointment_type: z.string(),
  description: z.string().optional(),
  is_emergency: z.boolean().default(false),
});

const AppointmentForm = () => {
  const [, startTransition] = useTransition();
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);
  const [isAppointmentDetailsPopupOpen, setIsAppointmentDetailsPopupOpen] =
    useState(false);

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { toast } = useToast();

  const defaultValues = {
    first_name: '',
    last_name: '',
    mobile_phone: '+1868',
    email: '',
    requested_date: addBusinessDays(startOfTomorrow(), 1),
    requested_time: 'flexible',
    appointment_type: '',
    description: '',
    is_emergency: false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (createdAppointment: Appointment) => {
    setCreatedAppointment(createdAppointment);
    setIsPreviewMode(true);
  };

  const handleConfirmAppointment = (createdAppointment: Appointment) => {
    startTransition(() => {
      createAppointmentFormAction(createdAppointment)
        .then((createdAppointment) => {
          toast({
            title: 'Your request was submitted',
            description: "We'll be in touch as soon as we can",
          });
          form.reset();
          setIsPreviewMode(false);
        })
        .catch((error) => {
          console.error('Failed to create appointment:', error);
          toast({
            title: 'Uh-oh. Something went wrong',
            description: 'Please try again or call the office',
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        });
    });
  };
  const handleGoBack = () => {
    setIsPreviewMode(false);
  };

  return (
    <>
      {isPreviewMode ? (
        <AppointmentPreview
          createdAppointment={createdAppointment!}
          handleConfirmAppointment={handleConfirmAppointment}
          handleGoBack={handleGoBack}
        />
      ) : (
        <div className="my-8 max-w-xs w-full">
          <h2 className="font-semibold text-xl my-5">
            Let&apos;s request your appointment.
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 bg-background"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Contact</FormLabel>
                    <FormControl>
                      <PhoneInputWithCountry
                        inputComponent={Input}
                        id="mobile_phone"
                        name="mobile_phone"
                        international={true}
                        addInternationalOption={false}
                        countryCallingCodeEditable={true}
                        countryOptionsOrder={['TT']}
                        limitMaxLength={true}
                        defaultCountry="TT"
                        control={form.control}
                        defaultValue="1868"
                        rules={{
                          required: 'Phone number is required.',
                          validate: (value: string) =>
                            isPossiblePhoneNumber(`${value}`) ||
                            'Please enter a valid phone number.',
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hello@email.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* date picker */}

              <FormField
                control={form.control}
                name="requested_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={[isSunday, isPast]}
                          toMonth={addMonths(new Date(), 3)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requested_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Time Preference</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time of day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="flexible">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose flexible if no preference.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time of day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="examination">Examination</SelectItem>
                        <SelectItem value="cleaning">
                          Cleaning/Polishing
                        </SelectItem>
                        <SelectItem value="extraction">Extraction</SelectItem>
                        <SelectItem value="filling">Filling</SelectItem>
                        <SelectItem value="other">Something Else</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us anything we should know"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_emergency"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>This is an emergency</FormLabel>
                      <FormDescription>
                        We&apos;ll try to prioritise your case
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default AppointmentForm;
