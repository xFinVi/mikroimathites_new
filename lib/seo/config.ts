export const seoConfig = {
  home: {
    title: "Μικροί Μαθητές | Αρχική",
    description:
      "Parent Hub για γονείς με παιδιά 0-6 ετών. Συμβουλές, δραστηριότητες και εκτυπώσιμα.",
    ogImage: "/images/logo.png",
  },
  "gia-goneis": {
    title: "Για Γονείς | Μικροί Μαθητές",
    description:
      "Σύντομες συμβουλές και πρακτικές ιδέες για την καθημερινότητα με το παιδί.",
    ogImage: "/images/logo.png",
  },
  drastiriotites: {
    title: "Δραστηριότητες & Εκτυπώσιμα | Μικροί Μαθητές",
    description:
      "Δραστηριότητες, παιχνίδια και εκτυπώσιμα για παιδιά 0-6 ετών.",
    ogImage: "/images/logo.png",
  },
  epikoinonia: {
    title: "Επικοινωνία | Μικροί Μαθητές",
    description:
      "Στείλτε ιδέα για βίντεο, feedback ή ερώτηση. Η γνώμη σας μετράει.",
    ogImage: "/images/logo.png",
  },
  sxetika: {
    title: "Σχετικά | Μικροί Μαθητές",
    description:
      "Ποιοι είμαστε και πώς βοηθάμε γονείς με παιδιά 0-6 ετών.",
    ogImage: "/images/logo.png",
  },
  notFound: {
    title: "Η σελίδα δεν βρέθηκε | Μικροί Μαθητές",
    description: "Η σελίδα δεν υπάρχει. Επιστροφή στην αρχική.",
    ogImage: "/images/logo.png",
  },
} as const;

export type SeoRouteKey = keyof typeof seoConfig;

