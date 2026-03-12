import Footer from './Footer';
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

import { Box, Button, GlobalStyles, Typography, styled } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const COLORS = {
  cardBg: '#f6f5e3',
  textSecondary: '#333',
  accent: '#9c6644',
  bulletInactive: '#d7c3ac',
};

const aboutData = [
  {
    title: "מייסד הישיבה",
    subtitle: "הרה\"ג רבי מרדכי עטייה זצוק\"ל (הסב)",
year: "תרנ\"ו",    content: `נולד בשנת תרנ"ח בחאלב שבאר"צ.
לאחר נישואיו (לרבנית אלגרה שמחה) בשנת תרפ"ב, היגר למקסיקו סיטי ושם הקים את קהילת "רודפי צדק" ושיקם את הקהילה היהודית שם.
מבין פעולותיו היה הקמת בית מדרש לתורה ותפילה, בניית מקווה טהרה, מסירת שיעורים לבני הקהילה, ועוד. בשהותו שם דיבר רבות אודות חובת העליה לארץ ישראל ועודד את הקמת הישוב היהודי בארץ.
לאחר עלייתו לארץ ישראל בשנת תרצ"ו בנה את ביתו ברח' יוסף בן מתתיהו
דאג רבות להקמת שכונות נוספות בירושלים שימש כשד"ר למוסדות תורה בארץ.
בשנת תש"ח, בזמן מלחמת השחרור היה מעודד את בני הישוב היהודי בגאולת עם ישראל והוציא אז תיבה לרחובה של עיר והיו קוראים את פרק ל"ז ביחזקאל "קרבו גויים לשמוע". היה מלמד פרק זה לילדים והיה אומר להגיד פרק זה בכל זמן המלחמה.
בשנת תשכ"ז הקים את ישיבת החיים והשלום בקומה התחתונה בביתו.
נפטר בשיבה טובה בי"ד תמוז תשל"ח.`,
    image: 'cacammorseci.jpg'
  },
  {
    title: "הקמת הישיבה",
    subtitle: "ישיבת \"עטרת מרדכי\" לבעלי תשובה",
year: "תשכ\"ז",    content: `לאחר פטירתו של הרב מרדכי עטייה (הסב) בשנת תשל"ח, הקים בנו הגאון ר' אליהו את ישיבת "עטרת מרדכי" לבעלי תשובה.
כאשר בנו הרב מרדכי עסק בפעילות של החזרה בתשובה, והביא את הבחורים ללמוד בישיבה. בזמן זה למדו בישיבה בחורים בהתמדה גדולה ובשקיעות עצומה.
בישיבה למדו באותה את גמ' והלכה מוסר ודברי חז"ל הכל לעומק ובעיוון, את השיעורים היו מוסרים גדולי הרבנים כדוגמת הרב אליהו מונסה זצוק"ל, ר' דוד אסולין זצוק"ל ועוד.
כמו כן נמסרו בה שיעורים בתורת הנסתר ובדברי רבנו האר"י זיע"א מפי מרן ראש הישיבה שליט"א.`,
    image: '/ysiva.png'
  },
  {
    title: "מרן ראש הישיבה",
year: "תש\"ח",    subtitle: "ממשיך השושלת והרב הנוכחי",
    content: `נולד בי"ח אדר ב' תש"ח לאביו הגאון ר' אליהו עטייה זצוק"ל בנו של הגאון המקובל האלוקי ר' מרדכי עטייה זצוק"ל.
מנעוריו קרבו זקנו להיות עימו בכל אשר יפנה ותמיד היה צמוד על שולחנו.    
בגיל 19 כשהוקמה ישיבת החיים והשלום התחיל ללמוד אצל זקנו את תורת הקבלה, בלימוד זה השתתפו גדולי הקבלה בזמנינו כמו ר' יעקב משה הלל שליט"א, הרב ישועה בן שושן זצ"ל ועוד רבים. לאחר מכן למד אצל המקובל האלוקי ר' מרדכי שרעבי זצוק"ל את תורת הקבלה, ומאז ועד היום מוסר הוא שיעורים בתורת הקבלה בישיבתנו הקדושה.
בשנים האחרונות הוציא את ספריו "עטרת מרדכי" י"ב כרכים אשר התקבלו באהדה רבה אצל כלל הלומדים בשמחה גדולה.`,
    image: 'DSC_5201.JPG'
  },
  {
    title: "הישיבה כיום",
year: "תשס\"ז",  subtitle: "כולל אברכים ומוסדות התורה",
    content: `בשנת תשס"ז הוקם כולל אברכים אשר מונה כיום כחמישים אברכים כ"י.
בכולל זה לומדים אברכים מובחרים אשר לומדים בהתמדה גדולה מתוך רוממות ושמחה.
הכולל הינו כולל דיינות אשר מטרתו היא להעמיד תלמידים הרבה מתוך ידיעה ושליטה מצויינת בטור ובשו"ע ובפוסקי זמננו.
בשנת תשפ"א הכולל נכנס למבנה המפואר והייחודי.
כיום הכולל משגשג ופורח וניכרת בו מעלתו העצומה ושקידתם הרבה של האברכים.`,
    image: 'באנר יוטיוב.jpg'
  }
];

const YearTypography = styled(Typography)({
  fontSize: 'clamp(2.3rem, 7vw, 7rem)',
  fontWeight: 600,
  lineHeight: 0.8,
  color: 'transparent',
  WebkitTextStroke: `2px ${COLORS.accent}`,
  opacity: 0.25,
  marginBottom: '-0px',
  userSelect: 'none',
  marginTop: '10px',
  fontFamily: 'serif',
});

const FullPageSection = styled(Box)({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  position: 'relative',
  '& .swiper': { width: '100%', height: '100%' },
  '& .swiper-pagination-bullet': {
    width: '18px', height: '18px',
    backgroundColor: COLORS.bulletInactive,
    opacity: 1,
    margin: '12px 0 !important',
  },
  '& .swiper-pagination-bullet-active': {
    backgroundColor: COLORS.accent,
    height: '45px',
    borderRadius: '15px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
});

const About: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <GlobalStyles styles={{ 'html, body, #root': { margin: 0, padding: 0, height: '100%', overflow: 'hidden' } }} />
      <FullPageSection>
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          speed={1000}
          mousewheel={{ forceToAxis: true, sensitivity: 1 }}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          modules={[Mousewheel, Pagination, Keyboard]}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          <SwiperSlide>
  <Box sx={{
    height: '100vh', 
    width: '100%', 
    position: 'relative',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.cardBg, 
    overflow: 'hidden', 
    direction: 'rtl', 
    textAlign: 'center',
  }}>
    {/* תוכן הטקסט מעל הסרטון */}
    <Box sx={{ zIndex: 11, p: { xs: 4, md: 10 } }}>
      <Typography variant="h1" sx={{ 
            fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS

        fontWeight: 900, 
        fontSize: { xs: '2.5rem', md: '5.5rem' }, 
        color: COLORS.textSecondary, 
        mb: 1,
        textShadow: '0px 2px 10px rgba(255,255,255,0.5)' // תוספת קטנה לקריאות על הוידאו
      }}>
        אודות
      </Typography>
      <Box sx={{ width: '100px', height: '6px', backgroundColor: COLORS.accent, mb: 4, mx: 'auto' }} />
      <Typography  variant="h3" sx={{     fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
color: COLORS.accent, fontWeight: 600, fontSize: { xs: '1.8rem', md: '3.5rem' }, mb: 2 }}>
        עטרת מרדכי
      </Typography>
      <Typography variant="h6" sx={{     fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
color: COLORS.textSecondary, maxWidth: '600px', mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
        מורשת של תורה, קבלה וחסד
      </Typography>
    </Box>

    {/* הסרטון בתור רקע */}
    <Box 
      component="video"
      autoPlay
      muted
      loop
      playsInline // קריטי לנגינה אוטומטית באייפון
      poster="/DSC_5492.webp" // תמונה שתוצג עד שהוידאו ייטען
      sx={{ 
        position: 'absolute', 
        inset: 0, 
        width: '100%',
        height: '100%',
        objectFit: 'cover', // גורם לוידאו למלא את כל המסך
        opacity: 0.6, // שומר על המראה העדין שהיה לתמונה הקודמת
        zIndex: 1 
      }}
    >
      <source src="/your-video.mp4" type="video/mp4" />
    </Box>
  </Box>
</SwiperSlide>
          {aboutData.map((item, index) => {
            const isVisible = activeIndex === index + 1;
            return (
              <SwiperSlide key={index}>
                <Box sx={{
                  height: '100vh',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                  backgroundColor: index % 2 === 0 ? '#fff' : COLORS.cardBg,
                  direction: 'rtl',
                  position: 'relative',
                  overflowY: 'auto',
                }}>
                  {/* חלק התמונה / 4 תמונות */}
                  <Box sx={{ flex: 1, height: { xs: '300px', md: '100vh' }, position: 'sticky', top: -5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.title === "הישיבה כיום" ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: { xs: 1, md: 3 }, width: '100%', height: '80%', p: { xs: 2, md: 3 } ,mt: { xs: -8, md: -12 }}}>
                          {[
                            { url: "/py.jpg", trans: "translate(40px, 40px) rotate(2deg)", delay: "1.2s" },
                            { url: "/DSC_5579.webp", trans: "translate(-40px, -40px) rotate(-3deg)", delay: "0.3s" },
                            { url: "/DSC_5604.webp", trans: "translate(40px, -40px) rotate(3deg)", delay: "0.6s", mt: 6 },
                            { url: "/DSC_5504.webp", trans: "translate(-40px, 40px) rotate(-2deg)", delay: "0.9s", mb: 6 }
                          ].map((img, i) => (
                            <Box
                              key={i}
                              sx={{
                                backgroundImage: `url(${img.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '24px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                                mt: { md: img.mt || 0 },
                                mb: { md: img.mb || 0 },
                                opacity: isVisible ? 1 : 0,
                                filter: isVisible ? 'blur(0px)' : 'blur(20px)',
                                transform: isVisible ? 'translate(0,0) rotate(0deg)' : img.trans,
                                transition: `opacity 2s ease-out ${img.delay}, filter 2s ease-out ${img.delay}, transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${img.delay}, box-shadow 0.4s ease`,
                                '&:hover': { transform: 'translateY(-10px) scale(1.03)', boxShadow: '0 20px 45px rgba(0,0,0,0.2)', zIndex: 10, cursor: 'pointer' }
                              }}
                            />
                          ))}
                        </Box>
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    )}
                  </Box>

                  {/* חלק הטקסט - המבנה המקורי והטוב */}
                  <Box sx={{ 
                    flex: 1.2, 
                    p: { xs: 3, md: "55px 60px" }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}>
                    <YearTypography sx={{     fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
mt: 0, mb: -0.5 }}>{item.year}</YearTypography>
                    
                    <Typography variant="h2" sx={{     fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
fontWeight: 600, mb: 0.5, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                      {item.title}
                    </Typography>

                    <Typography variant="h6" sx={{     fontFamily: "'YetziraCustom', sans-serif !important", // השם שהגדרנו ב-CSS
color: COLORS.accent, mb: 1.5, fontWeight: 500, fontSize: '1.1rem' }}>
                      {item.subtitle}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.8, color: COLORS.textSecondary, whiteSpace: 'pre-line', mb: 2 }}>
                      {item.content}
                    </Typography>

                    {/* המגילה - הגדולה והרחבה כפי שהייתה */}
                    {item.title === "מרן ראש הישיבה" && (
                      <Box sx={{ 
                        position: 'relative', 
                        width: '100%',
                        maxWidth: '900px', 
                        height: '190px',   
                        mt: -2.8, 
                        mx: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.05))'
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: 'url("/box.png")',
                          backgroundSize: '100% 100%',
                          backgroundRepeat: 'no-repeat',
                          zIndex: 0,
                          mixBlendMode: 'multiply',
                        }} />
                        
                        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 8 }}>
                          <Typography variant="body2" sx={{ 
                            fontStyle: 'italic', 
                            fontSize: '0.9rem', 
                            lineHeight: 1.2, 
                            color: '#3e2723', 
                            fontWeight: 550 
                          }}>
                          אני עומד ומשתומם. אינך יודע מי האיש הענק אתו דיברת. רבי מרדכי מקובל גאון של הדור שלנו. אולי אינך יודע שאין דרכי להפריז ולהגזים בשבחים ובתוארים. אך דע שאם יש מקובל בדורנו אמיתי חכם ובקי. צנוע ונחבא אל הכלים זה האיש וזה המקובל. הוא אשר השם יתברך בחר בו להיות בדורינו השם יאריך ימיו. ודע שכל הנקראים ״מקובלים לא יגיעו אפילו למחצית מידיעותיו ומחכמתו. אשרי הדור אשר רואה פניו.
                          </Typography>
                          <Typography sx={{ 
                            textAlign: 'left', 
                            fontSize: '0.75rem', 
                            fontWeight: 500, 
                            color: '#9c6644', 
                            mt: 0.5 
                          }}>
                            — הרב בן ציון מוצפי שליט"א
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}

        <SwiperSlide>
  <Box sx={{ 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    backgroundColor: '#fff',
    pt: -10
  }}>
    <Box 
      sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        position: 'relative' // נדרש בשביל המיקום של הכפתור
      }}
    >
      {/* מיכל המגילה והכפתור */}
      <Box sx={{ position: 'relative', width: 'fit-content', maxWidth: '1000px' }}>
        
        {/* תמונת המגילה */}
        <Box
          component="img"
          src="/megila.png"
          sx={{
            width: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.12))',
          }}
        />

        {/* הכפתור השקוף מעל אזור ה"לחצו כאן" */}
        <Button
          onClick={() => navigate('/ModernScrollDonation')
}
          sx={{
            position: 'absolute',
            bottom: '21%', // מיקום יחסי מעל הטקסט במגילה
            left: '50%',
            transform: 'translateX(-50%)',
            width: '35%',  // רוחב האזור הלחיץ
            height: '8%',  // גובה האזור הלחיץ
            backgroundColor: 'rgba(255, 0, 0, 0)', // שקוף (שני ל-rgba(255,0,0,0.2) כדי לראות אותו בזמן הבדיקה)
            cursor: 'pointer',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            }
          }}
        />
      </Box>
    </Box>

  </Box>
</SwiperSlide>
           <SwiperSlide>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
              
              {/* <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ color: COLORS.accent, fontWeight: 300 }}>עטרת מרדכי</Typography>
              </Box> */}
              <Footer />
            </Box>
          </SwiperSlide>
        </Swiper>
      </FullPageSection>
    </>
  );
};

export default About;