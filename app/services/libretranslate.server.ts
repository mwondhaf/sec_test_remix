export const translateArToEn = async (ar_text: string) => {
  const res = await fetch(`${process.env.LIBRE_URL}/translate`, {
    method: "POST",
    body: JSON.stringify({
      q: ar_text.toString(),
      source: "ar",
      target: "en",
      format: "text",
      alternatives: 0,
      api_key: "",
    }),
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();
  return response.translatedText;
};

export const translateEnToAr = async (en_text: string) => {
  const res = await fetch(`${process.env.LIBRE_URL}/translate`, {
    method: "POST",
    body: JSON.stringify({
      q: en_text.toString(),
      source: "en",
      target: "ar",
      format: "text",
      alternatives: 0,
      api_key: "",
    }),
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();
  return response.translatedText;
};
