import React, { useState } from 'react';

const styles: Record<string, React.CSSProperties> = {
  page: {
    direction: 'rtl',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 18px',
    boxSizing: 'border-box',
    background: '#fff',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    color: '#222',
  },
  container: { width: '100%', maxWidth: 1160 },
  title: { textAlign: 'center', fontSize: 36, margin: '0 0 20px', fontWeight: 700 },
  card: {
    display: 'flex',
    gap: 28,
    background: '#f3f3d9',
    padding: 28,
    borderRadius: 18,
    alignItems: 'stretch',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    flexWrap: 'wrap',
  },
  leftCol: { flex: '0 0 36%', padding: '10px 18px', boxSizing: 'border-box', minWidth: 240 },
  leftTitle: { fontSize: 20, margin: 0, marginBottom: 10, fontWeight: 700 },
  leftText: { fontSize: 14, lineHeight: 1.6, color: '#333' },
  rightCol: { flex: '1 1 64%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 280 },
  form: {
    width: '100%',
    maxWidth: 560,
    background: '#fff',
    padding: 18,
    borderRadius: 12,
    boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
    boxSizing: 'border-box',
  },
  row: { marginBottom: 12 },
  twoCols: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  input: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', color: '#222' },
  textarea: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, minHeight: 140, resize: 'vertical' as const },
  select: { width: '100%', boxSizing: 'border-box', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', color: '#222' },
  submit: { width: '100%', background: '#922b2b', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
};

const AskRabbiForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [rabbi, setRabbi] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, email, rabbi, question });
    alert('השאלה נשלחה (demo) — בדוק את הקונסול.');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>שאל את הרב</h1>

        <div style={styles.card}>
          <aside style={styles.leftCol}>
            <h2 style={styles.leftTitle}>הסבר על שאלות</h2>
            <p style={styles.leftText}>
              ניתן לשאול שאלות כלליות על הלכה, קבלה, או נושאים רוחניים. השאלות
              ייבדקו על ידי צוות הרבנים שלנו. אנא הקפד לספק פרטים חיוניים כדי
              שנוכל לענות בצורה מדויקת.
            </p>
          </aside>

          <section style={styles.rightCol}>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={{ ...styles.row, ...styles.twoCols }}>
                <input
                  style={styles.input}
                  placeholder="שם פרטי"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-label="שם פרטי"
                />
                <input
                  style={styles.input}
                  placeholder="שם משפחה"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  aria-label="שם משפחה"
                />
              </div>

              <div style={{ ...styles.row, ...styles.twoCols }}>
                <input
                  style={styles.input}
                  placeholder={'דוא\"ל'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="דואל"
                />
                <select
                  style={styles.select}
                  value={rabbi}
                  onChange={(e) => setRabbi(e.target.value)}
                  aria-label="בחר רב"
                >
                  <option value="">בחר רב</option>
                  <option value="ravA">הרב א'</option>
                  <option value="ravB">הרב ב'</option>
                  <option value="ravC">הרב ג'</option>
                </select>
              </div>

              <div style={styles.row}>
                <textarea
                  style={styles.textarea}
                  placeholder="תוכן השאלה"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  aria-label="תוכן השאלה"
                />
              </div>

              <div style={styles.row}>
                <button type="submit" style={styles.submit}>שליחה</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AskRabbiForm;
