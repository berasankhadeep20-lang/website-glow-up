import { motion } from "framer-motion";

const education = [
  { school: "IISER Kolkata", detail: "BS-MS (Currently Pursuing)" },
  { school: "Bhavans Gangabux Kanoria Vidyamandir", detail: "Class 12 – 89.8% (CBSE 2025)" },
  { school: "St. Joseph's College Bowbazar", detail: "Class 10 – 94% (ICSE 2023)" },
];

const EducationSection = () => (
  <section id="education" className="py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold gradient-text mb-12 text-center">Education Timeline</h2>
      <div className="relative border-l-2 border-primary/30 ml-4">
        {education.map((e, i) => (
          <motion.div
            key={e.school}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="mb-10 ml-8 relative"
          >
            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full gradient-bg glow-primary" />
            <div className="glass rounded-xl p-5 hover:-translate-y-1 transition-transform">
              <h3 className="text-primary font-semibold">{e.school}</h3>
              <p className="text-sm text-muted-foreground">{e.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EducationSection;
