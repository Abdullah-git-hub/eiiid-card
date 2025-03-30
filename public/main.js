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

user_wish.value = "";

user_wish.addEventListener("input", () => {
    textarea_length.innerText = user_wish.value.length;
    page_content_p.innerText = user_wish.value;
});

user_name.addEventListener("input", () => {
    page_content_h3.innerHTML = "<span>from,</span><br />" + user_name.value;
});

user_photo.addEventListener("change", (e) => {
    const photo = user_photo.files[0];

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        avatar.src = reader.result;
    });

    reader.readAsDataURL(photo);
});

// changes in style
user_style.forEach((radio) => {
    radio.addEventListener("change", function () {
        const selectedStyle = this.value;
        userStyleIndex = selectedStyle;
        setCardStyle(selectedStyle);
    });
});

card_container.addEventListener("click", () => {
    card_container.classList.toggle("card-movement");
    page_1.classList.toggle("page-movement");
    page_2.classList.toggle("page-movement");
});

if (cardUser == null) {
    document.body.style.overflow = "hidden";
    document.querySelector(".login_modal").style.display = "flex";
    document.querySelector(".login_modal_back").style.display = "block";
    login_menu_btn.style.display = "block";
    logout_menu_btn.style.display = "none";
    console.log(3939);
}

auth.onAuthStateChanged((user) => {
    if (user != null) {
        cardUser = user;
        document.querySelector(".login_modal").style.display = "none";
        document.querySelector(".login_modal_back").style.display = "none";
        login_menu_btn.style.display = "none";
        logout_menu_btn.style.display = "block";
        document.body.style.overflow = "auto";

        // get data
        db.collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();

                    page_content_h3.innerHTML =
                        "<span>from,</span><br />" + userData.user_name;
                    avatar.src = userData.user_photo;
                    page_content_p.innerText = userData.user_wish;
                    // setCardStyle(userData.style);
                } else {
                    console.log("No such document!");
                }

                share_url_input.value =
                    window.location.origin +
                    "/share/?uid=" +
                    auth.currentUser.uid;
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        document.body.style.overflow = "hidden";
        document.querySelector(".login_modal").style.display = "flex";
        document.querySelector(".login_modal_back").style.display = "block";
        login_menu_btn.style.display = "block";
        logout_menu_btn.style.display = "none";
    }
});

logout_menu_btn.addEventListener("click", () => {
    auth.signOut()
        .then(() => {
            window.reload();
        })
        .catch((error) => {
            console.log(error);
        });
});

// Google Login
googleLoginBtn.addEventListener("click", function () {
    auth.signInWithPopup(provider)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
});

// update data
eid_card_form.addEventListener("submit", (e) => {
    e.preventDefault();

    form_submit_btn.innerText = "Updating...";

    // geting imgLink
    let imgFile = user_photo.files[0];
    let imgName = cardUser.uid;
    let metadata = {
        contentType: imgFile.type,
    };
    secondaryStorage
        .child(imgName)
        .put(imgFile, metadata)
        .then((snap) => snap.ref.getDownloadURL())
        .then((url) => {
            imgLink = url;
            console.log(url);

            db.collection("users").doc(cardUser.uid).set({
                user_name: user_name.value,
                user_photo: url,
                user_wish: user_wish.value,
                style: userStyleIndex,
            });

            form_submit_btn.innerText = "Updated!!!";

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const shareUrlInput = document.getElementById("share_url");
    const shareButton = document.querySelector(".share_btn");

    shareButton.addEventListener("click", function () {
        if (shareUrlInput) {
            // Select the text inside the input field
            shareUrlInput.select();
            shareUrlInput.setSelectionRange(0, shareUrlInput.value.length); // For mobile browsers

            try {
                document.execCommand("copy");

                shareButton.textContent = "Copied!";
                setTimeout(() => {
                    shareButton.textContent = "Copy to share";
                }, 2000);
            } catch (err) {
                console.error("Unable to copy to clipboard", err);
                shareButton.textContent = "Copy failed";
                setTimeout(() => {
                    shareButton.textContent = "Copy to share";
                }, 2000);
            }

            shareUrlInput.blur();
        }
    });
});

function setCardStyle(selectedStyle = 1) {
    const styleArr = [
        ["#b78443", "white"],
        ["#945300", "#2b0000"],
        ["#b78443", "#2b0000"],
        ["#e9a443", "white"],
        ["#ffc570", "white"],
        ["#004715", "#004715"],
    ];

    page_1_img.src = "../asset/" + selectedStyle + "_1.png";
    page_2_img.src = "../asset/" + selectedStyle + "_2.png";
    page_3_img.src = "../asset/" + selectedStyle + "_3.png";

    page_content_h3.style.color = styleArr[selectedStyle - 1][0];
    document.querySelector(".avatar").style.borderColor =
        styleArr[selectedStyle - 1][0];
    page_content_p.style.color = styleArr[selectedStyle - 1][1];
}
