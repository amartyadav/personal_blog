// translations.js - Contains all website text in different languages
const translations = {
    // English translations (original)
    en: {
        "name": "Amartya Yadav",
        "title": "MSc Student in High Performance Computing",
        "institution": "EPCC, University of Edinburgh",
        
        "nav.home": "Home",
        "nav.about": "About",
        "nav.projects": "Projects",
        "nav.updates": "Updates",
        "nav.contact": "Contact",
        
        "intro.p1": "Hi! I'm Amartya. I'm a software developer currently pursuing my MSc in High Performance Computing at EPCC, University of Edinburgh. I specialize in parallel and scientific computing, backend development, mobile applications.",
        "intro.p2": "I'm passionate about applied mathematics, high-performance computing, open-source software, socio-political issues, and the intersection of technology and society. When I'm not coding, you'll find me trekking mountains, reading political and social science literature, or working out.",
        
        "section.currentProjects": "Current Projects and Research",
        "project.title": "Implementing Taylor Green Vortex Decay using Lattice-Boltzmann methods on Cerebras CS2",
        "project.description": "As part of my MSc project under the supervision of Dr. Justs Zarins at EPCC, I am working on implementing the Taylor Green Vortex Decay problem using Lattice-Boltzmann methods on the Cerebras CS2 accelerator. While this problem has been previously implemented in parallel using OpenMP, MPI, and CUDA for Nvidia GPUs, a similar implementation for the Cerebras CS2 is yet to be achieved.",
        
        "section.publishedApps": "Published Apps",
        "app.panchang": "Quick Panchang - Hindu Calendar and Festivals:",
        "app.getOnMac": "Get it on the Mac App Store",
        "app.mandi": "Mandi Mitra - Sabzi Mandi Price Calculator:",
        "app.getOnMobile": "Get it on Google Play Store or Apple App Store [click the link on your phone]"
    },
    
    // Hindi translations
    hi: {
        "name": "अमर्त्य यादव",
        "title": "हाई परफॉरमेंस कंप्यूटिंग में एमएससी छात्र",
        "institution": "ईपीसीसी, एडिनबर्ग विश्वविद्यालय",
        
        "nav.home": "होम",
        "nav.about": "परिचय",
        "nav.projects": "प्रोजेक्ट्स",
        "nav.updates": "अपडेट्स",
        "nav.contact": "संपर्क",
        
        "intro.p1": "नमस्ते! मेरा नाम अमर्त्य है। हम एक सॉफ्टवेयर डेवलपर हैं और वर्तमान में एडिनबर्ग विश्वविद्यालय के EPCC में हाई परफॉरमेंस कंप्यूटिंग में एमएससी कर रहे हैं। हम समानांतर(पैरेलल) और वैज्ञानिक कंप्यूटिंग, बैकएंड डेवलपमेंट, एवं मोबाइल एप्लिकेशन डेवलपमेंट में विशेषज्ञता रखते हैं।",
        "intro.p2": "हम अनुप्रयुक्त गणित, हाई परफॉरमेंस कंप्यूटिंग, ओपन-सोर्स सॉफ्टवेयर, सामाजिक-राजनीतिक मुद्दों और प्रौद्योगिकी और समाज के अंतर्संबंध के बारे में जुनूनी हैं। जब हम कोडिंग नहीं कर रहे होते हैं, तब आप हमें पहाड़ चढ़ते, राजनीतिक और सामाजिक विज्ञान साहित्य पढ़ते, या कसरत करते हुए पाएंगे।",
        
        "section.currentProjects": "वर्तमान प्रोजेक्ट्स और शोध",
        "project.title": "सेरेब्रास सीएस - ३ पर लैटिस-बोल्ट्ज़मैन विधियों का उपयोग करके टेलर ग्रीन वोर्टेक्स डिके को लागू करना",
        "project.description": "EPCC में डॉ. युस्तस ज़ारिन्स के पर्यवेक्षण में अपने एमएससी प्रोजेक्ट के हिस्से के रूप में हम सेरेब्रास सीएस - ३ एक्सेलरेटर पर लैटिस-बोल्ट्ज़मैन विधियों को लागू करने पर काम कर रहे हैं। हालांकि इस समस्या को पहले OpenMP, MPI एवं Nvidia GPUs के लिए CUDA का उपयोग करके समानांतर (पैरेलल) में लागू किया गया है, सेरेब्रास सीएस - ३ के लिए एक समान कार्यान्वयन अभी तक प्राप्त नहीं किया गया है।",
        
        "section.publishedApps": "प्रकाशित ऐप्स",
        "app.panchang": "क्विक पंचांग - हिंदू कैलेंडर और त्योहार:",
        "app.getOnMac": "मैक ऐप स्टोर पर प्राप्त करें",
        "app.mandi": "मंडी मित्र - सब्जी मंडी प्राइस कैलकुलेटर:",
        "app.getOnMobile": "गूगल प्ले स्टोर या ऐप्पल ऐप स्टोर पर प्राप्त करें [अपने फोन पर लिंक को क्लिक करें]"
    }
    
    // You can add more languages here as needed, for example:
    // fr: { ... French translations ... }
};