import { useState } from "react";

const useCopyToClipboard = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 300000); // 5 minutes
    });
  };

  return { hasCopied, copyToClipboard };
};

export default useCopyToClipboard;
