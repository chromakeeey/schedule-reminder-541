function getHtml() {
    alert('called')
    document.getElementById("demo").innerHTML = "Paragraph changed.";

    const htmlString = document.getElementsByTagName('html')[0].innerHTML;
    console.log(htmlString)
}

function onClick() {
    alert('clicked')
    document.getElementById("demo").innerHTML = "Paragraph changed.";
}