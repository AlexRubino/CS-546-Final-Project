(function () {
    const form = document.getElementById("item-form")
    if (form) {
        form.addEventListener("submit", (event) => {
            document.getElementsByName("incomplete-error")[0].classList.add("hidden")
            document.getElementsByName("file-error")[0].classList.add("hidden")

            const name = document.getElementById("name")
            name.classList.remove("input-error")
            const description = document.getElementById("short_description")
            description.classList.remove("input-error")
            const img = document.getElementById("item_img")
            img.classList.remove("input-error")
            const startBid = document.getElementById("starting_bid")
            startBid.classList.remove("input-error")
            const startDate = document.getElementById("start")
            startDate.classList.remove("input-error")
            const endDate = document.getElementById("end")
            endDate.classList.remove("input-error")

            let err = false

            if (!name.value) {
                name.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!description.value) {
                description.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!img.value) {
                img.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!startBid.value) {
                startBid.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!startDate.value) {
                startDate.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!endDate.value) {
                endDate.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (startBid.value < 0) {
                event.preventDefault()
                startBid.classList.add("input-error")
                document.getElementsByName("incomplete-error")[0].classList.remove("hidden")
                document.getElementsByName("incomplete-error")[0].textContent = "The starting bid must not be negative!"
            }

            if (Date.parse(startDate.value) > Date.parse(endDate.value)) {
                event.preventDefault()
                startDate.classList.add("input-error")
                endDate.classList.add("input-error")
                document.getElementsByName("incomplete-error")[0].classList.remove("hidden")
                document.getElementsByName("incomplete-error")[0].textContent = "The End Date must be later than the Start Date!"
            }

            if (err) {
                event.preventDefault()
                document.getElementsByName("incomplete-error")[0].classList.remove("hidden")
                document.getElementsByName("incomplete-error")[0].textContent = "Please fill in the required fields!"
            }
        })
    }
})()