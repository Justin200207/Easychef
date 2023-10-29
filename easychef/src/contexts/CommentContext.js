import { createContext, useState } from "react";

export const useCommentContext = () => {
    const [comment, setComment] = useState({
        recipe: '',
        owner: '',
        text: '',
        add_comment_images: [], // POST only (id of images)
        comment_images: [], // GET only (id of images)
    })

    return {
        comment,
        setComment,
    }
}

const CommentContext = createContext({
    comment: {
        recipe: '',
        owner: '',
        text: '',
        add_comment_images: [], // POST only (id of images)
        comment_images: [], // GET only (id of images)
    },
    setStep: () => {},
});

export default StepContext
