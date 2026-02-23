document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".header__burger");
    const header = document.querySelector(".header");
    const headerLinks = document.querySelectorAll(".link-menu__inner");
    if(header){
        const makeScrolled = () => {
            if(window.pageYOffset > 0) header.classList.add("_scroll");
            else header.classList.remove("_scroll") 
        }

        if(burger){
            burger.addEventListener("click", () => {
                header.classList.toggle("_active");
                document.body.classList.toggle("_locked");
            });
        }
        if(headerLinks.length > 0){
            headerLinks[0].addEventListener("focus", () => {
                header.classList.add("_active");
                document.body.classList.add("_locked");
            });
            headerLinks[headerLinks.length - 1].addEventListener("keydown", (e) => {
                if(e.key === "Tab"){
                    header.classList.remove("_active");
                    document.body.classList.remove("_locked");
                }
            });
            headerLinks.forEach((link, i) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    const target = document.querySelector(link.getAttribute('href'));
                    if (!target) return;

                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - header.offsetHeight;

                    header.classList.remove("_active");
                    document.body.classList.remove("_locked");
                    window.scrollTo({top: offsetPosition, behavior: 'smooth'});
                });
                if(burger){
                    burger.tabIndex = 1;
                    if(window.innerWidth <= 480){
                        link.tabIndex = i + 2;
                    }
                }
            });
        }
        makeScrolled();
        window.addEventListener("scroll", makeScrolled);
    }

    const inputName = document.querySelector("#your_name");
    const errorName = document.querySelector("#your_name ~ .field-contact__error");
    const inputEmail = document.querySelector("#your_email");
    const errorEmail = document.querySelector("#your_email ~ .field-contact__error");
    const inputMessage = document.querySelector(".textarea-contact__input");
    const errorMessage = document.querySelector(".textarea-contact__error");
    const buttonSend = document.querySelector(".contact__send");
    if(buttonSend && errorMessage && inputMessage && errorEmail && inputEmail && errorName && inputName){
        buttonSend.addEventListener("click", (e) => {
            e.preventDefault();

            if(inputName.value.trim() === ""){
                errorName.innerHTML = "Введіть своє Імʼя...";
            } else if(inputName.value.length < 2){
                errorName.innerHTML = "Занадто коротке Імʼя...";
            } else if(!/^[a-zA-Zа-яА-ЯіІїЇєЄ'-]+(?: [a-zA-Zа-яА-ЯіІїЇєЄ'-]+)*$/.test(inputName.value)){
                errorName.innerHTML = "Мають бути тільки Букви...";
            } else {
                errorName.innerHTML = "";
            }

            if(inputEmail.value.trim() === ""){
                errorEmail.innerHTML = "Введіть свою Пошту..."
            } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail.value)){
                errorEmail.innerHTML = "Некоректний формат Пошти...";
            } else {
                errorEmail.innerHTML = "";
            }

            if(inputMessage.value.trim() === ""){
                errorMessage.innerHTML = "Введіть свою Ідею..."
            } else {
                errorMessage.innerHTML = "";
            }

            if(errorName.innerHTML.trim() !== "" || errorEmail.innerHTML.trim() !== "" || errorMessage.innerHTML.trim() !== ""){
                return;
            }

            const nameValue = encodeURIComponent(inputName.value);
            const emailValue = encodeURIComponent(inputEmail.value);
            const messageValue = encodeURIComponent(inputMessage.value);

            fetch(`https://example.com/api?name=${nameValue}&email=${emailValue}&message=${messageValue}`, {
                method: "GET"
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Все успішно!:", data); 
                })
                .catch(error => {
                    console.error("Трапилась помилка!:", error);
                });
        })
    }
    
    const modalButtons = document.querySelectorAll(".open-modal");

    const modal = document.querySelector(".modal-win");

    const modalSelect = document.querySelector(".select-modal-win");
    const modalSelectOpener = document.querySelector(".select-modal-win__opener button");
    const modalSelectOpenerValue = document.querySelector(".select-modal-win__opener button em");
    const modalSelectContainer = document.querySelector(".select-modal-win__container");
    const modalSelectList = document.querySelector(".select-modal-win__list");
    const modalSelectLinks = document.querySelectorAll(".select-modal-win__link button");

    const modalCloser = document.querySelector(".modal-win__closer");
    const modalInput = document.querySelector(".field-modal-win__input");
    const modalError = document.querySelector(".field-modal-win__error");
    const modalConfirm = document.querySelector(".modal-win__confirm");

    const allActive = document.querySelectorAll("a, button, input, iframe, textarea");
    const insideActive = (modal) ? modal.querySelectorAll("a, button, input") : [];
    const outsideActive = (modal) ? [...allActive].filter(el => !modal.contains(el)) : [];

    const closeModalWin = () => {
        document.body.classList.remove("_locked");
        document.body.classList.remove("_appear-modal");
        insideActive.forEach(el => el.tabIndex = -1);
        outsideActive.forEach(el => {
            if(window.innerWidth <= 480 && headerLinks.length > 0){
                if(el.classList.contains("header__burger")){
                    el.tabIndex = 1;
                    return;
                }
                if(el.classList.contains("link-menu__inner")){
                    el.tabIndex = 2 + [...headerLinks].indexOf(el);
                    return;
                }
            }
            el.tabIndex = 0;
        });

        if(modalInput) modalInput.value = 1
        if(modalSelectOpenerValue) modalSelectOpenerValue.innerHTML = ""
        if(modalSelectOpener) modalSelectOpener.disabled = false;
        if(modalSelect) modalSelect.classList.remove("_active");
        if(modalSelectContainer) modalSelectContainer.style.height = "";
    }
    const openModalWin = () => {
        document.body.classList.add("_locked");
        document.body.classList.add("_appear-modal");

        insideActive.forEach(el => el.tabIndex = 0);
        outsideActive.forEach(el => el.tabIndex = -1);
    }
    
    modalButtons.forEach(modalButton => {
        const openSettings = modalButton.getAttribute("data-opener");
        if(openSettings !== undefined){
            if(openSettings === "select"){
                modalButton.addEventListener("click", openModalWin);
                return;
            }
            let choosedValue = "";
            switch(openSettings){
                case "kyiv": choosedValue = "Київ / Docker-G Pub"; break;
                case "lviv": choosedValue = "Львів / !FESTrepublic"; break;
                case "odesa": choosedValue = "Одеса / Зелен театр"; break;
                case "kharkiv": choosedValue = "Харків / ArtZavod"; break;
            }
            
            modalButton.addEventListener("click", () => {
                openModalWin();
                if(choosedValue !== ""){
                    if(modalSelectOpenerValue) modalSelectOpenerValue.innerHTML = choosedValue;
                    if(modalSelectOpener) modalSelectOpener.disabled = true;
                }
            });
        }
    });

    if(modalSelectLinks.length !== 0 && modalSelectOpenerValue){
        modalSelectLinks.forEach(modalSelectLink => {
            modalSelectLink.addEventListener("click", (e) => {
                const alreadyDisabled = document.querySelector(".select-modal-win__link button:disabled");
                if(alreadyDisabled){
                    alreadyDisabled.disabled = false;
                }
                e.currentTarget.disabled = true;
                modalSelectOpenerValue.innerHTML = e.currentTarget.innerHTML;
            })
        });
        if(modalSelect && modalSelectContainer){
            modalSelectLinks[0].addEventListener("focus", () => {
                modalSelect.classList.add("_active");
                modalSelectContainer.style.height = modalSelectList.offsetHeight + "px";
            });
            modalSelectLinks[modalSelectLinks.length - 1].addEventListener("keydown", (e) => {
                if(e.key === "Tab"){
                    modalSelect.classList.remove("_active");
                    modalSelectContainer.style.height = "";
                }
            });
        }
    }

    if(modalSelectOpener && modalSelectContainer && modalSelectList){
        modalSelectOpener.addEventListener("click", () => {
            modalSelect.classList.toggle("_active");
            if(modalSelect.classList.contains("_active")){
                modalSelectContainer.style.height = modalSelectList.offsetHeight + "px"
            } else {
                modalSelectContainer.style.height = "";
            }
        });
    }

    if(modalCloser){
        modalCloser.addEventListener("click", () => {
            closeModalWin();
            if(modalError) modalError.innerHTML = "";
        });
        modalCloser.addEventListener("focus", () => {
            document.body.classList.add("_locked");
            document.body.classList.add("_appear-modal");
        });
    }

    if(modalConfirm && modalInput && modalError && modalSelectOpenerValue){
        modalConfirm.addEventListener("click", () => {
            if(modalInput.value.trim() === ""){
                modalError.innerHTML = "Введіть К-сть...";
                return;
            } else if(modalSelectOpenerValue.innerHTML.trim() === ""){
                modalError.innerHTML = "Оберіть Місце...";
                return;
            } else {
                modalError.innerHTML = "";
            }

            closeModalWin();
        });
        modalConfirm.addEventListener("keydown", (e) => {
            if(e.key === "Tab"){
                closeModalWin();
            }
        });
    }

    const supportsWebP = () => {
        try {
            const canvas = document.createElement('canvas');
            if (!!(canvas.getContext && canvas.getContext('2d'))) {
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            } else return false;
        } catch (e) { return false; }
    }

    if (supportsWebP()) {
        document.body.classList.add('webp');
    }
});