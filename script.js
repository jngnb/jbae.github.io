function openWindow(id, title, filePath) {
    // Prevent opening the same window multiple times
    if (document.querySelector(`.window[data-id="${id}"]`)) {
        console.log(`Window "${id}" is already open. Returning...`);
        return;
    }
    // if (document.querySelector(`.window[data-id="${id}"]`)) return;

    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            let win = document.createElement("div");
            win.classList.add("window");
            win.setAttribute("data-id", id);
            win.innerHTML = `
                <div class="title-bar">
                    ${title}
                    <div class="close-btn" onclick="closeWindow(this)">X</div>
                </div>
                <div class="content">
                    ${html}
                </div>
            `;
            document.body.appendChild(win);
            dragElement(win);
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

function closeWindow(btn) {
    btn.closest(".window").remove();
}

function dragElement(el) {
    let titleBar = el.querySelector(".title-bar");
    titleBar.onmousedown = function(event) {
        let shiftX = event.clientX - el.getBoundingClientRect().left;
        let shiftY = event.clientY - el.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            el.style.left = pageX - shiftX + 'px';
            el.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };
}
