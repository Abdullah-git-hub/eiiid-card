const card_container = document.querySelector(".card-container"),
    page_1 = document.querySelector(".page-1"),
    page_2 = document.querySelector(".page-2"),
    page_3 = document.querySelector(".page-3"),
    login_menu_btn = document.querySelector("#login_menu"),
    logout_menu_btn = document.querySelector("#logout_menu"),
    user_name = document.querySelector("#user_name"),
    user_photo = document.querySelector("#user_photo"),
    user_wish = document.querySelector("#user_wish"),
    user_style = document.getElementsByName("style_option"),
    page_1_img = document.querySelector("#page_1_img"),
    page_2_img = document.querySelector("#page_2_img"),
    page_3_img = document.querySelector("#page_3_img"),
    textarea_length = document.querySelector("#textarea_length > span"),
    page_content_p = document.querySelector(".page-content > p"),
    page_content_h3 = document.querySelector(".page-content > h3"),
    avatar = document.querySelector(".avatar > img"),
    eid_card_form = document.querySelector("#eid_card_form"),
    form_submit_btn = document.querySelector(".button-29"),
    share_btn = document.querySelector(".share_btn"),
    share_url_input = document.querySelector("#share_url");

let cardUser;
let userStyleIndex = 1;

card_container.addEventListener("click", () => {
    card_container.classList.toggle("card-movement");
    page_1.classList.toggle("page-movement");
    page_2.classList.toggle("page-movement");
});

const urlString = window.location.href;
const url = new URL(urlString);
const uid = url.searchParams.get("uid");

if (uid) {
    db.collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();

                page_content_h3.innerHTML =
                    "<span>from,</span><br />" + userData.user_name;
                document.querySelector("#card_sender_name").innerText =
                    userData.user_name;
                avatar.src = userData.user_photo;
                page_content_p.innerText = userData.user_wish;
                setCardStyle(userData.style);
            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
} else {
    console.log("UID parameter not found in the URL.");
}

function setCardStyle(selectedStyle = 1) {
    const styleArr = [
        ["#b78443", "white"],
        ["#945300", "#2b0000"],
        ["#b78443", "#2b0000"],
        ["#e9a443", "white"],
        ["#ffc570", "white"],
        ["#004715", "#004715"],
    ];

    const bg = [1, 2, 2, 1, 1, 1];

    page_1_img.src = "../asset/" + selectedStyle + "_1.png";
    page_2_img.src = "../asset/" + selectedStyle + "_2.png";
    page_3_img.src = "../asset/" + selectedStyle + "_3.png";

    page_content_h3.style.color = styleArr[selectedStyle - 1][0];
    document.querySelector(".avatar").style.borderColor =
        styleArr[selectedStyle - 1][0];
    page_content_p.style.color = styleArr[selectedStyle - 1][1];
    document.body.style.backgroundImage = `url('../asset/${
        bg[selectedStyle - 1]
    }.png')`;
}
