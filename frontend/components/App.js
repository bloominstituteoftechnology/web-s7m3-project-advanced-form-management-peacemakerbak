// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import axios from 'axios'
import React, {useState, useEffect} from 'react'
import * as Yup from 'yup';



const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const userSchema = Yup.object().shape({
  username: Yup.string().required(e.usernameRequired).min(3, e.usernameMin).max(20, e.usernameMax),
  favLanguage: Yup.mixed().required(e.favLanguageRequired).oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: Yup.mixed().required(e.favFoodRequired).oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: Yup.boolean().oneOf([true], e.agreementRequired)
});


const getInitialValues = () => {
  return {
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: false,
  }
}

const getInitialErrors = () => {
  return {
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: '',
  }

}

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [values, setValues] = useState(getInitialValues())
  const [errors, setErrors] = useState(getInitialErrors())
  const [serverSuccess, setServerSuccess] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmittable, setIsSubmittable] = useState(false)
  
  useEffect(() => {
  userSchema.isValid(values).then(setIsSubmittable)
   }, [values])


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let {name, value, type, checked} = evt.target
    value = type === 'checkbox' ? checked : value
    setValues({...values, [name]: type === 'checkbox' ? checked : value})
    Yup.reach(userSchema, name).validate(value)
    .then(() => setErrors({...errors, [name]: ''}))
    .catch(err => setErrors({...errors, [name]: err.errors[0]}))
    
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post('https://webapis.bloomtechdev.com/registration', values)
    .then(res => {
      setServerSuccess(res.data.message)
      setValues(getInitialValues())
      setErrors(getInitialErrors())
      setServerError('')
    })
    .catch(err => {
      setServerError(err.response.data.message)
    })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit = {onSubmit}>
        { serverSuccess && <h4 className="success">{serverSuccess}</h4> }
        { serverError && <h4 className="error">{serverError}</h4> }

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={values.username} onChange={onChange}
          id="username" name="username" type="text" placeholder="Type Username" />
          { errors.username && <div className="validation">{errors.username}</div> }
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input checked={values.favLanguage === 'javascript'} onChange={onChange}
              type="radio" name="favLanguage" value="javascript" />
              JavaScript
            </label>
            <label>
              <input checked={values.favLanguage === 'rust'} onChange={onChange}
              type="radio" name="favLanguage" value="rust" />
              Rust
            </label>
          </fieldset>
          { errors.favLanguage && <div className="validation">{errors.favLanguage}</div> }
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={values.favFood} onChange={onChange}
          id="favFood" name="favFood">
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          { errors.favFood && <div className="validation">{errors.favFood}</div> }
        </div>

        <div className="inputGroup">
          <label>
            <input checked={values.agreement} onChange={onChange}
            id="agreement" type="checkbox" name="agreement" />
            Agree to our terms
          </label>
          { errors.agreement && <div className="validation">{errors.agreement}</div> }
        </div>

        <div>
          <input disabled={!isSubmittable} className="button" value="Submit"
          type="submit" />
        </div>
      </form>
    </div>
  )
}
