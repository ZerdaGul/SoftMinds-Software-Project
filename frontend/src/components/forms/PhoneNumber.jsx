import React from 'react';
import { useField } from 'formik';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import "./form.scss";

const PhoneNumber = ({ label, ...props }) => {
const [field, meta, helpers] = useField(props);

	return (
		<>
		<label>
			{label}
			<PhoneInput
			className="form__input"
			// style={{padding: 0}}
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
			defaultCountry="ua"
			value={field.value}
			onChange={(phone) => helpers.setValue(phone)}
			/>
		</label>
		{meta.touched && meta.error ? (
			<div className="error">{meta.error}</div>
		) : null}
		</>
	);
};

export default PhoneNumber;
