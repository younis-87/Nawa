document.getElementById("inputName").addEventListener("input", function() {

    document.getElementById("name").textContent = this.value || "__________";

});

document.getElementById("inputLocation").addEventListener("input", function() {

    document.getElementById("location").textContent = this.value || "__________";

});

document.getElementById("inputPhoto").addEventListener("change", function(event) {

    let file = event.target.files[0];

    if (file) {

        let reader = new FileReader();

        reader.onload = function(e) {

            document.getElementById("photo").src = e.target.result;

        };

        reader.readAsDataURL(file);

    }

});

const updateDate = () => {

    let day = document.getElementById("day").value.padStart(2, '0') || "__";

    let month = document.getElementById("month").value.padStart(2, '0') || "__";

    let year = document.getElementById("year").value || "____";

    document.getElementById("date").textContent = `${day} / ${month} / ${year}`;

};

document.getElementById("day").addEventListener("input", updateDate);

document.getElementById("month").addEventListener("input", updateDate);

document.getElementById("year").addEventListener("input", updateDate);

function saveAsImage() {

    html2canvas(document.getElementById("card"), { scale: 2 }).then(canvas => {

        let link = document.createElement("a");

        link.href = canvas.toDataURL("image/png");

        link.download = "death_notice.png";

        link.click();

    });

}