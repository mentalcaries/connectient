'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { loginFormAction } from './actions'
import type LoginFormData from '@/types/LoginFormData'
import styles from '@styles/loginform.module.css'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const LoginForm = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    defaultValues: {
      userName: '',
      userPassword: '',
    },
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(async (data) => {
    // Log in the browser
    const { userName, userPassword } = data
    console.log(data)
    await supabase.auth.signInWithPassword({
      email: userName,
      password: userPassword,
    })

    router.refresh()
    // startTransition(() => {
    //   loginFormAction(data)
    // })
  })

  return (
    <form
      className={styles.loginForm}
      onSubmit={(event) => void onSubmit(event)}
    >
      <div className={styles.loginFormSection}>
        <label className={styles.inputLabel} htmlFor="userName">
          Username
        </label>
        <input
          className={styles.input}
          type="text"
          id="userName"
          placeholder="Enter username"
          {...register('userName', {
            required: 'Username is required.',
            minLength: {
              value: 4,
              message: 'Username should be at least 4 chars long',
            },
          })}
        />
        <p className={styles.error}>
          {errors.userName && errors.userName.message}
        </p>
      </div>
      <div className={styles.loginFormSection}>
        <label className={styles.inputLabel} htmlFor="userPassword">
          Password
        </label>
        <input
          className={styles.input}
          type="password"
          id="userPassword"
          placeholder="Enter password"
          {...register('userPassword', {
            required: 'Password is required.',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 chars long',
            },
          })}
        />
        <p className={styles.error}>
          {errors.userPassword && errors.userPassword.message}
        </p>
      </div>
      <div className={styles.loginFormSection}>
        <button
          className={
            !isDirty || (isDirty && !isValid)
              ? styles.submitButtonDisabled
              : styles.submitButton
          }
          type="submit"
          disabled={!isDirty || (isDirty && !isValid)}
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default LoginForm
