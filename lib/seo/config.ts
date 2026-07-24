export const SITE_NAME = "Μικροί Μαθητές";

// Titles are unbranded — the root layout title template appends "| Μικροί Μαθητές".
// The home title is used as-is (absolute) so the brand isn't doubled.
export const seoConfig = {
  home: {
    title: "Μικροί Μαθητές – Δραστηριότητες, Συμβουλές & Εκτυπώσιμα για Γονείς",
    description:
      "Parent Hub για γονείς με παιδιά 0-6 ετών. Συμβουλές, δραστηριότητες και εκτυπώσιμα.",
    ogImage: "/images/logo.png",
    path: "/",
  },
  "gia-goneis": {
    title: "Για Γονείς",
    description:
      "Σύντομες συμβουλές και πρακτικές ιδέες για την καθημερινότητα με το παιδί.",
    ogImage: "/images/logo.png",
    path: "/gia-goneis",
  },
  drastiriotites: {
    title: "Δραστηριότητες & Εκτυπώσιμα",
    description:
      "Δραστηριότητες, παιχνίδια και εκτυπώσιμα για παιδιά 0-6 ετών.",
    ogImage: "/images/logo.png",
    path: "/drastiriotites",
  },
  epikoinonia: {
    title: "Επικοινωνία",
    description:
      "Στείλτε ιδέα για βίντεο, feedback ή ερώτηση. Η γνώμη σας μετράει.",
    ogImage: "/images/logo.png",
    path: "/epikoinonia",
  },
  "gine-xorigos": {
    title: "Γίνετε Χορηγός",
    description:
      "Υποστηρίξτε την κοινότητά μας και φτάστε σε χιλιάδες γονείς. Κάντε αίτηση για να γίνετε χορηγός.",
    ogImage: "/images/logo.png",
    path: "/gine-xorigos",
  },
  sxetika: {
    title: "Σχετικά",
    description:
      "Ποιοι είμαστε και πώς βοηθάμε γονείς με παιδιά 0-6 ετών.",
    ogImage: "/images/logo.png",
    path: "/sxetika",
  },
  privacy: {
    title: "Πολιτική Απορρήτου",
    description:
      "Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα.",
    ogImage: "/images/logo.png",
    path: "/privacy",
  },
  terms: {
    title: "Όροι & Προϋποθέσεις",
    description:
      "Οι όροι χρήσης του ιστότοπου Μικροί Μαθητές.",
    ogImage: "/images/logo.png",
    path: "/terms",
  },
  support: {
    title: "Στηρίξτε μας",
    description:
      "Η υποστήριξή σας βοηθάει να δημιουργούμε δωρεάν περιεχόμενο για γονείς. Μάθετε πώς η συνεισφορά σας υποστηρίζει την εργασία μας.",
    ogImage: "/images/logo.png",
    path: "/support",
  },
  donate: {
    title: "Συνεισφορά",
    description:
      "Στηρίξτε μας μέσω PayPal. Κάθε συνεισφορά βοηθάει να δημιουργούμε περισσότερο δωρεάν περιεχόμενο για γονείς.",
    ogImage: "/images/logo.png",
    path: "/donate",
  },
  notFound: {
    title: "Η σελίδα δεν βρέθηκε",
    description: "Η σελίδα δεν υπάρχει. Επιστροφή στην αρχική.",
    ogImage: "/images/logo.png",
    path: null,
  },
} as const;

export type SeoRouteKey = keyof typeof seoConfig;
