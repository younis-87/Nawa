// وظائف تحديث النعوة
document.getElementById("inputName").addEventListener("input", function() {
    document.getElementById("name").textContent = this.value || "__________";
});

document.getElementById("inputLocation").addEventListener("input", function() {
    document.getElementById("location").textContent = this.value || "__________";
});

document.getElementById("inputPhoto").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        // التحقق من نوع الملف
        if (!file.type.match('image.*')) {
            alert("يرجى اختيار ملف صورة صالح");
            return;
        }
        
        let reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("photo").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// تحديث التاريخ مع ضبطه تلقائياً على التاريخ الحالي
const setCurrentDate = () => {
    const today = new Date();
    const currentDay = today.getDate().toString().padStart(2, '0');
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = today.getFullYear().toString();
    
    document.getElementById("day").value = currentDay;
    document.getElementById("month").value = currentMonth;
    document.getElementById("year").value = currentYear;
    
    updateDate();
};

const updateDate = () => {
    let day = document.getElementById("day").value.padStart(2, '0') || "__";
    let month = document.getElementById("month").value.padStart(2, '0') || "__";
    let year = document.getElementById("year").value || "____";
    document.getElementById("date").textContent = `${day}/${month}/${year}`;
};

// تحديث التاريخ عند تغيير القيم
document.getElementById("day").addEventListener("input", updateDate);
document.getElementById("month").addEventListener("input", updateDate);
document.getElementById("year").addEventListener("input", updateDate);

// ضبط التاريخ الحالي عند تحميل الصفحة
window.addEventListener("load", setCurrentDate);

// حفظ النعوة كصورة
function saveAsImage() {
    // إظهار رسالة تحميل
    const saveBtn = document.querySelector('.primary-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="icon-loading"></span> جاري الحفظ...';
    saveBtn.disabled = true;
    
    // استخدام html2canvas لتحويل البطاقة إلى صورة
    html2canvas(document.getElementById("card"), { 
        scale: 2, // جودة أعلى
        useCORS: true, // للسماح بتحميل الصور من مصادر خارجية
        backgroundColor: null // للحفاظ على الخلفية الشفافة إن وجدت
    }).then(canvas => {
        // إنشاء رابط تنزيل
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "نعوة_وفاة.png";
        link.click();
        
        // إعادة زر الحفظ إلى حالته الأصلية
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 1000);
    }).catch(err => {
        console.error("حدث خطأ أثناء حفظ الصورة:", err);
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        alert("حدث خطأ أثناء حفظ الصورة. يرجى المحاولة مرة أخرى.");
    });
}

// مشاركة على فيسبوك
function shareOnFacebook() {
    // إنشاء صورة من البطاقة أولاً
    html2canvas(document.getElementById("card"), { 
        scale: 2,
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        // تحويل الصورة إلى URL بيانات
        const imageData = canvas.toDataURL("image/png");
        
        // عرض الصورة في نافذة المعاينة
        document.getElementById("previewImage").src = imageData;
        
        // تحديث رابط المشاركة على فيسبوك
        updateFacebookShareButton(imageData);
        
        // عرض نافذة المشاركة
        document.getElementById("shareModal").style.display = "block";
    }).catch(err => {
        console.error("حدث خطأ أثناء إنشاء صورة للمشاركة:", err);
        alert("حدث خطأ أثناء تجهيز الصورة للمشاركة. يرجى المحاولة مرة أخرى.");
    });
}

// تحديث زر مشاركة فيسبوك
function updateFacebookShareButton(imageUrl) {
    // الحصول على اسم المتوفى للاستخدام في نص المشاركة
    const deceasedName = document.getElementById("name").textContent;
    
    // إنشاء نص المشاركة
    const shareText = `نعوة وفاة: ${deceasedName !== "__________" ? deceasedName : "المرحوم"} - صفحة أهل ديربعلبة`;
    
    // تحديث زر مشاركة فيسبوك
    // ملاحظة: في التطبيق الحقيقي، يجب استخدام رابط فعلي للصورة بدلاً من URL البيانات
    // لأن فيسبوك لا يقبل URL البيانات للصور
    
    // في هذه الحالة، نستخدم Facebook SDK للمشاركة
    if (window.FB) {
        document.querySelector('.fb-share-button').setAttribute('data-href', window.location.href);
        FB.XFBML.parse();
    }
}

// إغلاق نافذة المشاركة
function closeShareModal() {
    document.getElementById("shareModal").style.display = "none";
}

// نسخ رابط المشاركة
function copyShareLink() {
    // في التطبيق الحقيقي، هذا سيكون رابط الصفحة الفعلية
    // هنا نستخدم رابط الصفحة الحالية كمثال
    const shareLink = window.location.href;
    
    // نسخ الرابط إلى الحافظة
    navigator.clipboard.writeText(shareLink).then(() => {
        // تغيير نص الزر مؤقتاً للإشارة إلى نجاح النسخ
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="icon-check"></i> تم النسخ';
        
        // إعادة النص الأصلي بعد ثانيتين
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error("حدث خطأ أثناء نسخ الرابط:", err);
        alert("حدث خطأ أثناء نسخ الرابط. يرجى المحاولة مرة أخرى.");
    });
}

// إغلاق نافذة المشاركة عند النقر خارجها
window.onclick = function(event) {
    const modal = document.getElementById("shareModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// مشاركة مباشرة على فيسبوك (بديل)
function directFacebookShare() {
    const name = document.getElementById("name").textContent;
    const shareTitle = `نعوة وفاة: ${name !== "__________" ? name : "المرحوم"} - صفحة أهل ديربعلبة`;
    
    // استخدام Facebook Sharer URL
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareTitle)}`;
    
    // فتح نافذة مشاركة فيسبوك
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// إضافة أيقونة تحميل للأزرار
document.head.insertAdjacentHTML('beforeend', `
<style>
.icon-loading {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
}

.icon-check:before {
    content: "✓";
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
`);

// تهيئة SDK فيسبوك
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_APP_ID', // يجب استبداله بمعرف التطبيق الخاص بك
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v17.0'
    });
};
