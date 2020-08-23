(function () {
    const itemForm = document.getElementById("item-form")
    const signupForm = document.getElementById("signup-form")
    if (itemForm) {
        itemForm.addEventListener("submit", (event) => {
            document.getElementById("incomplete-error").classList.add("hidden")
            if (document.getElementById("file-error")) {
                document.getElementById("file-error").classList.add("hidden")
            }

            const name = document.getElementById("name")
            name.classList.remove("input-error")
            const description = document.getElementById("short_description")
            description.classList.remove("input-error")
            const img = document.getElementById("item_img")
            img.classList.remove("input-error")
            const startBid = document.getElementById("starting_bid")
            startBid.classList.remove("input-error")
            const endDate = document.getElementById("end")
            endDate.classList.remove("input-error")
            const endTime = document.getElementById("endtime")
            endTime.classList.remove("input-error")
            const dateTime = endDate.value + " " + endTime.value;
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

            if (!endDate.value) {
                endDate.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!endTime.value) {
                endTime.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (startBid.value < 0) {
                event.preventDefault()
                startBid.classList.add("input-error")
                document.getElementById("incomplete-error").classList.remove("hidden")
                document.getElementById("incomplete-error").textContent = "The starting bid must not be negative!"
            }

            if (!/jpeg|jpg|png|gif/.test(img.value.split('.').pop())) {
                event.preventDefault()
                img.classList.add("input-error")
                document.getElementById("incomplete-error").classList.remove("hidden")
                document.getElementById("incomplete-error").textContent = "The file is not an image!"
            }

            if (Date.now() > Date.parse(dateTime)) {
                // alert(Date.now())
                // alert(Date.now()> Date.parse(endDate.value)) ;
                // alert(endDate.value);
                event.preventDefault()
                endDate.classList.add("input-error")
                endTime.classList.add("input-error")
                document.getElementById("incomplete-error").classList.remove("hidden")
                document.getElementById("incomplete-error").textContent = "The end date and time must be later than now!"
            }

            if (err) {
                event.preventDefault()
                document.getElementById("incomplete-error").classList.remove("hidden")
                document.getElementById("incomplete-error").textContent = "Please fill in the required fields!"
            }
        })
    } else if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            document.getElementById("incomplete-error").classList.add("hidden")

            const fname = document.getElementById("fname")
            fname.classList.remove("input-error")
            const lname = document.getElementById("lname")
            lname.classList.remove("input-error")
            const city = document.getElementById("city")
            city.classList.remove("input-error")
            const state = document.getElementById("state")
            state.classList.remove("input-error")
            const email = document.getElementById("email")
            email.classList.remove("input-error")
            const username = document.getElementById("username")
            username.classList.remove("input-error")
            const password = document.getElementById("password")
            password.classList.remove("input-error")
            const confirm = document.getElementById("confirm")
            password.classList.remove("input-error")
            let err = false

            if (!fname.value) {
                fname.classList.add("input-error")

                event.preventDefault()
                err = true
            }

            if (!lname.value) {
                lname.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!city.value) {
                city.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!state.value) {
                state.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!email.value) {
                email.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!username.value) {
                username.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!password.value) {
                password.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (!confirm.value) {
                confirm.classList.add("input-error")
                event.preventDefault()
                err = true
            }

            if (confirm.value !== password.value) {
                // alert(Date.now())
                // alert(Date.now()> Date.parse(endDate.value)) ;
                // alert(endDate.value);
                event.preventDefault()
                password.classList.add("input-error")
                confirm.classList.add("input-error")
                document.getElementById("incomplete-error").classList.remove("hidden")
                document.getElementById("incomplete-error").textContent = "Confirmation password and password does not match!"
            }

            if (err) {
                event.preventDefault()
                document.getElementById("incomplete-error").classList.remove("hidden")
                document.getElementById("incomplete-error").textContent = "Please fill in the required fields!"
            }
        })
    }
})()