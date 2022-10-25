var buttons = document.getElementsByClassName("download_section_button");
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', e => {
        e,preventDefault()
        document.getElementById("download_section").scrollIntoView({behavior: 'smooth'});
    }, false);
}