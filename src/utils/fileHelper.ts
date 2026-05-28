export const downloadFile = (content: string, fileName: string, isBase64: boolean = false) => {
  const link = document.createElement('a');

  if (isBase64) {
    link.href = content;
  } else {
    const blob = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
  }

  link.download = fileName;
  link.click();

  if (!isBase64) {
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }
};
