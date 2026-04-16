import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";

const ResumeSection = () => (
  <section id="resume" className="py-24 px-6">
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold gradient-text mb-4">Resume / CV</h2>
        <p className="text-muted-foreground mb-8">
          Download or view my latest resume to learn more about my qualifications and experience.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-8 inline-flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center">
          <FileText className="w-10 h-10 text-primary-foreground" />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Sankhadeep Bera</h3>
          <p className="text-sm text-muted-foreground">BS-MS Student · IISER Kolkata</p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="https://www.overleaf.com/read/jgbhqxmdqwjk#f2faa5"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:scale-110 transition-transform shadow-lg shadow-primary/25 inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Resume
          </a>
          <a
            href="https://www.overleaf.com/read/jgbhqxmdqwjk#f2faa5"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-primary text-primary px-6 py-2.5 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ResumeSection;
