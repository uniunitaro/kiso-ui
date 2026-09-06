'use client'
import { OTPField as Base } from '@base-ui/react/otp-field'
import { otpField } from '../../../styled-system/recipes'
import { createStyleContext } from './style-context'
const { withProvider, withContext } = createStyleContext(otpField)
export const Root = withProvider(Base.Root, 'root')
export const Input = withContext(Base.Input, 'input')
export const Separator = withContext(Base.Separator, 'separator')
