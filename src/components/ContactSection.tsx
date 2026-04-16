import { motion } from "framer-motion";

const links = [
  { label: "Email", value: "berasankhadeep20@gmail.com", url: "mailto:berasankhadeep20@gmail.com" },
  { label: "GitHub", value: "berasankhadeep20-lang", url: "https://github.com/berasankhadeep20-lang" },
  { label: "Codeforces", value: "Ronnie_Deep_04", url: "https://codeforces.com/profile/Ronnie_Deep_04" },
  { label: "LinkedIn", value: "View Profile", url: "https://www.linkedin.com/in/sankhadeep-bera-64a1a0364/" },
  { label: "X", value: "@RonnieDeep04", url: "https://x.com/RonnieDeep04" },
  { label: "Instagram", value: "@ronnie_deep_04", url: "https://www.instagram.com/ronnie_deep_04/" },
  { label: "YouTube", value: "My Channel", url: "https://youtube.com/@ronniedeep?si=4gIuIxmUHyXl4WKy" },
];

const ContactSection = () => (
  <section id="contact" className="py-24 px-6">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold gradient-text mb-10">Connect With Me</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl px-5 py-3 text-left hover:glow-primary transition-all hover:-translate-y-1 block"
          >
            <div className="text-xs text-muted-foreground">{l.label}</div>
            <div className="text-sm text-primary font-medium">{l.value}</div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ContactSection;
