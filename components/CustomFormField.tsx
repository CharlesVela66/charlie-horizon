import React from 'react';
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { customInputProps } from '@/types';

const CustomFormField = ({
  label,
  control,
  type,
  placeholder,
}: customInputProps) => {
  return (
    <FormField
      control={control}
      name={type}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label capitalize">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                id={type}
                placeholder={placeholder}
                className="input-class"
                type={type === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomFormField;
