interface ImpactCard {
  icon: string;
  title: string;
  description: string;
  color: "pink" | "blue" | "yellow" | "green";
}

const impactCards: ImpactCard[] = [
  {
    icon: "🎥",
    title: "Παραγωγή Βίντεο",
    description:
      "Η υποστήριξή σας βοηθάει στην παραγωγή εκπαιδευτικών βίντεο που βοηθούν τα παιδιά να μαθαίνουν διασκεδάζοντας.",
    color: "pink",
  },
  {
    icon: "📝",
    title: "Δημιουργία Περιεχομένου",
    description:
      "Χρηματοδοτούμε τη δημιουργία άρθρων, δραστηριοτήτων και εκτυπώσιμων που είναι δωρεάν για όλους τους γονείς.",
    color: "blue",
  },
  {
    icon: "💻",
    title: "Συντήρηση Ιστοσελίδας",
    description:
      "Βοηθάτε να διατηρούμε και να βελτιώνουμε τον ιστότοπο, ώστε να είναι πάντα προσβάσιμος και εύκολος στη χρήση.",
    color: "yellow",
  },
  {
    icon: "❤️",
    title: "Κοινότητα & Υποστήριξη",
    description:
      "Η συνεισφορά σας επιτρέπει να χτίζουμε μια δυνατή κοινότητα που στηρίζει τους γονείς με πρακτικές λύσεις.",
    color: "green",
  },
];

const colorClasses = {
  pink: {
    gradient: "from-primary-pink/10 via-primary-pink/5 to-white",
    border: "border-primary-pink/20 hover:border-primary-pink/40",
    iconBg: "from-primary-pink to-primary-pink/70",
    glow: "bg-primary-pink/10",
    text: "text-primary-pink",
  },
  blue: {
    gradient: "from-secondary-blue/10 via-secondary-blue/5 to-white",
    border: "border-secondary-blue/20 hover:border-secondary-blue/40",
    iconBg: "from-secondary-blue to-secondary-blue/70",
    glow: "bg-secondary-blue/10",
    text: "text-secondary-blue",
  },
  yellow: {
    gradient: "from-accent-yellow/10 via-accent-yellow/5 to-white",
    border: "border-accent-yellow/20 hover:border-accent-yellow/40",
    iconBg: "from-accent-yellow to-accent-yellow/70",
    glow: "bg-accent-yellow/10",
    text: "text-accent-yellow",
  },
  green: {
    gradient: "from-accent-green/10 via-accent-green/5 to-white",
    border: "border-accent-green/20 hover:border-accent-green/40",
    iconBg: "from-accent-green to-accent-green/70",
    glow: "bg-accent-green/10",
    text: "text-accent-green",
  },
};

export function ImpactCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      {impactCards.map((card, index) => {
        const colors = colorClasses[card.color];
        return (
          <div
            key={index}
            className={`group relative bg-gradient-to-br ${colors.gradient} rounded-3xl p-8 sm:p-10 shadow-lg hover:shadow-2xl border-2 ${colors.border} transition-all duration-300 transform hover:-translate-y-2`}
          >
            {/* Decorative Elements */}
            <div
              className={`absolute top-4 right-4 w-20 h-20 ${colors.glow} rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity`}
            />
            <div
              className={`absolute bottom-4 left-4 w-16 h-16 ${colors.glow} rounded-full blur-xl opacity-30`}
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-text-dark">
                  {card.title}
                </h3>
              </div>

              <p className="text-base sm:text-lg text-text-medium leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

