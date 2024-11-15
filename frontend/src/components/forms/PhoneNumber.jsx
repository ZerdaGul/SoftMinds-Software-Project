import React from 'react';
import { useField } from 'formik';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import "./form.scss";

const PhoneNumber = ({ label,getCountry, ...props  }) => {
const [field, meta, helpers] = useField(props);

	const handleChange = (phone, {country}) => {
		getCountry(country.name)
		helpers.setValue(phone)
	}
	return (
		<>
		<label>
			{label}
			<PhoneInput
				className="form__input"
				inputStyle={{border: 'none',
							borderRadius: '24px',
							height: '100%',
							width: '260px',
							fontSize: '16px'}}
				countrySelectorStyleProps={{buttonStyle: {
					border: 'none',
					height: '100%',
					borderRadius: '24px',
				}}}
				{...field}
				defaultCountry="tr"
				value={field.value}
				onChange={handleChange}
			/>
		</label>
		{meta.touched && meta.error ? (
			<div className="error">{meta.error}</div>
		) : null}
		</>
	);
};

export default PhoneNumber;
