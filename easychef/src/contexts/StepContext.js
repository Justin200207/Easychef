import { createContext, useState } from "react";

export const useStepContext = () => {
    const [step, setStep] = useState({
        recipe: '',
        text: '',
        prep_time: '',
        cooking_time: '',
        add_step_images: '', // POST only (id of images)
        step_images: '', // GET only
    })

    return {
        step,
        setStep,
    }
}

const StepContext = createContext({
    step: {
        recipe: '',
        text: '',
        prep_time: '',
        cooking_time: '',
        add_step_images: '', // POST only (id of images)
        step_images: '', // GET only
    },
    setStep: () => {},
});

export default StepContext
