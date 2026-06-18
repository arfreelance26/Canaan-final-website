export const EMAILJS_CONFIG = {
  Shipping: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SHIPPING_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_SHIPPING_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_SHIPPING_PUBLIC_KEY,
  },
  Transportation: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_TRANSPORTATION_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TRANSPORTATION_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_TRANSPORTATION_PUBLIC_KEY,
  },
  "RFID Seals": {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_RFID_SEALS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_RFID_SEALS_TEMPLATE_ID,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_RFID_SEALS_PUBLIC_KEY,
  },
};
