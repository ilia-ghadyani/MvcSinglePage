// پس از بارگزاری کامل اچ تی ام ال ، ایونت های صفحه را فعال می کند
document.addEventListener("DOMContentLoaded", InitializePage);

function InitializePage() {
    // هنگام باز شدن صفحه، اطلاعات افراد را بارگذاری می‌کندئ
    GetAllPerson();

    // ایونت دکمه‌ها و چک‌باکس‌ها را ثبت می‌کند
    document.getElementById("btnAdd")
        .addEventListener("click", CreatePerson);

    document.getElementById("btnEdit")
        .addEventListener("click", EditPerson);

    document.getElementById("btnDelete")
        .addEventListener("click", DeletePeople);

    document.getElementById("btnRefresh")
        .addEventListener("click", RefreshPeople);

    document.getElementById("selectAll")
        .addEventListener("change", SelectAllPeople);

    // // تغییر وضعیت چک‌باکس‌های ردیف‌های جدول را مدیریت می‌کند
    document.getElementById("peopleTableBody")
        .addEventListener("change", HandlePersonSelection);
}



// اطلاعات افراد را از سرور دریافت کرده و در جدول نمایش می‌دهد
async function GetAllPerson() {
    try {
        const response = await fetch("/Person/GetAll");

        if (!response.ok) {
            throw new Error("Failed to retrieve people.");
        }

        const people = await response.json();

        const tableBody = document.getElementById("peopleTableBody");

        // ردیف‌های قبلی جدول را حذف می‌کند تا اطلاعات جدید نمایش داده شوند
        tableBody.innerHTML = "";

        people.forEach(person => {
            const row = document.createElement("tr");

            // آیدی شخص را برای استفاده‌های بعدی روی ردیف ذخیره می‌کند
            row.dataset.id = person.id;

            row.innerHTML = `
                <td>
                    <input
                        type="checkbox"
                        class="form-check-input person-checkbox">
                </td>
                <td></td>
                <td></td>
            `;

            // نام‌ها را به‌صورت متن نمایش می‌دهد، نه کد اچ تی ام ال 
            row.cells[1].textContent = person.firstName;
            row.cells[2].textContent = person.lastName;

            tableBody.appendChild(row);
        });

        // تعداد کل افراد را بروزرسانی می‌کند
        document.getElementById("totalCount").textContent = people.length;

        // پس از بارگذاری مجدد جدول، وضعیت انتخاب‌ها را بازنشانی می‌کند
        document.getElementById("selectAll").checked = false;
        SyncSelectedPerson();

        return true;
    }
    catch (error) {
        console.error("Error retrieving people:", error);
        alert("Failed to retrieve people from the server.");

        return false;
    }
}



// اطلاعات فرم را برای ثبت شخص جدید به سرور ارسال می‌کند
async function CreatePerson(event) {
    event.preventDefault();

    const form = document.getElementById("personForm");
    const formData = new FormData(form);

    try {
        const response = await fetch("/Person/Create", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Create failed:", error);

            alert("Failed to create the person.");
            return;
        }

        const result = await response.json();

        alert(result.message);

        // پس از ثبت موفق، فرم را خالی و جدول را بروزرسانی می‌کند
        ClearPersonForm();
        await GetAllPerson();
    }
    catch (error) {
        console.error("Error creating person:", error);
        alert("A connection error occurred while creating the person.");
    }
}



// اطلاعات شخص انتخاب ‌شده در جدول را ویرایش می‌کند
async function EditPerson(event) {
    event.preventDefault();

    const selectedCheckboxes = document.querySelectorAll(
        "#peopleTableBody .person-checkbox:checked"
    );

    // برای ویرایش، باید دقیقاً یک نفر انتخاب شده باشد
    if (selectedCheckboxes.length !== 1) {
        alert("Please select exactly one person to edit.");
        return;
    }

    const form = document.getElementById("personForm");
    const personId = document.getElementById("personId").value;

    // مقادیر قبلی را از ردیف شخص انتخاب‌ شده دریافت می‌کند
    const selectedCheckbox = document.querySelector(
        "#peopleTableBody .person-checkbox:checked"
    );

    const selectedRow = selectedCheckbox.closest("tr");

    const originalFirstName = selectedRow.cells[1].textContent.trim();
    const originalLastName = selectedRow.cells[2].textContent.trim();

    //مقادیر فعلی را از فرم دریافت می‌کند
    const currentFirstName = document.getElementById("firstName").value.trim();
    const currentLastName = document.getElementById("lastName").value.trim();

    // بررسی می‌کند که حداقل یکی از فیلدها تغییر کرده باشد
    if (
        currentFirstName === originalFirstName &&
        currentLastName === originalLastName
    ) {
        alert("No changes detected. Please modify the first name or last name before editing.");
        return;
    }

    if (!personId) {
        alert("Please select a person to edit.");
        return;
    }

    const formData = new FormData(form);

    // آیدی شخص انتخاب ‌شده را در درخواست ارسال می‌کند
    formData.set("Id", personId);

    try {
        const response = await fetch("/Person/Edit", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Edit failed:", error);

            alert("Failed to update the person.");
            return;
        }

        const result = await response.json();

        alert(result.message);

        // پس از ادیت موفق، فرم را خالی و جدول را بروزرسانی می‌کند
        ClearPersonForm();
        await GetAllPerson();
    }
    catch (error) {
        console.error("Error editing person:", error);
        alert("A connection error occurred while updating the person.");
    }
}



/* افراد انتخاب‌شده را با ارسال درخواست
 جداگانه برای هر نفر حذف می‌کند
*/
async function DeletePeople(event) {
    event.preventDefault();

    const selectedCheckboxes = document.querySelectorAll(
        "#peopleTableBody .person-checkbox:checked"
    );

    // بررسی می‌کند که حداقل یک نفر انتخاب شده باشد
    if (selectedCheckboxes.length === 0) {
        alert("Please select at least one person to delete.");
        return;
    }

    const personIds = Array.from(selectedCheckboxes).map(checkbox => {
        return checkbox.closest("tr").dataset.id;
    });

    // تعداد افراد جدول را پیش از حذف مشخص می‌کند
    const totalPeopleCount = document.querySelectorAll(
        "#peopleTableBody .person-checkbox"
    ).length;

    // بررسی می‌کند که آیا همهٔ افراد جدول برای حذف انتخاب شده‌اند
    const isDeletingAllPeople = personIds.length === totalPeopleCount;

    // پیش از حذف افراد انتخاب ‌شده، تأیید می‌گیرد
    const confirmed = confirm(
        `Are you sure you want to delete ${personIds.length} selected person(s)?`
    );

    if (!confirmed) {
        return;
    }

    const form = document.getElementById("personForm");
    const antiForgeryToken = form.querySelector(
        'input[name="__RequestVerificationToken"]'
    )?.value;

    let successCount = 0;
    let failedCount = 0;

    // برای حذف هر شخص، یک درخواست پست جداگانه ارسال می‌کند.
    for (const personId of personIds) {
        const formData = new FormData();

        formData.append("Id", personId);

        if (antiForgeryToken) {
            formData.append("__RequestVerificationToken", antiForgeryToken);
        }

        try {
            const response = await fetch("/Person/Delete", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                failedCount++;
                continue;
            }

            successCount++;
        }
        catch (error) {
            console.error(`Failed to delete person ${personId}:`, error);
            failedCount++;
        }
    }

    // پس از پایان درخواست‌های حذف، جدول را به‌روزرسانی و فرم را خالی می‌کند
    await GetAllPerson();
    ClearPersonForm();

    // نتیجهٔ واقعی عملیات حذف را گزارش می‌دهد
    if (failedCount === 0) {

        // پیام موفقیت را بر اساس تعداد افراد حذف‌شده تنظیم می‌کند
        if (successCount === 1) {
            alert("The person was deleted successfully.");
        }
        else if (isDeletingAllPeople) {
            alert("All people were deleted successfully.");
        }
        else {
            alert(`${successCount} people were deleted successfully.`);
        }
    }
    else {
        alert(
            `Deletion completed with errors.\n` +
            `Successfully deleted: ${successCount}\n` +
            `Failed: ${failedCount}`
        );
    }
}



// لیست را از سرور به‌روزرسانی کرده و فرم را خالی می‌کند
async function RefreshPeople() {
    const isRefreshed = await GetAllPerson();

    ClearPersonForm();

    if (isRefreshed) {
        alert("The people list has been refreshed successfully.");
    }
}



// مدیریت انتخاب ردیف و بروزرسانی وضعیت چک ‌باکس انتخاب همه
function HandlePersonSelection(event) {
    if (!event.target.classList.contains("person-checkbox")) {
        return;
    }

    SyncSelectedPerson();

    // وضعیت چک‌ باکس انتخاب همه را با چک‌ باکس ‌های ردیف‌ها هماهنگ می‌کند
    const checkboxes = document.querySelectorAll(
        "#peopleTableBody .person-checkbox"
    );

    const checkedCount = document.querySelectorAll(
        "#peopleTableBody .person-checkbox:checked"
    ).length;

    document.getElementById("selectAll").checked =
        checkboxes.length > 0 &&
        checkedCount === checkboxes.length;
}



/*
  با تغییر چک باکس بالای جدول ، همه ی ردیف ها را انتخاب 
 یا از حالت انتخاب خارج میکنه و متد پایینی و کال میکنه   
*/
function SelectAllPeople() {
    const selectAllCheckbox = document.getElementById("selectAll");

    const checkboxes = document.querySelectorAll(
        "#peopleTableBody .person-checkbox"
    );

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });

    // فقط در صورت انتخاب دقیقاً یک نفر، اطلاعات او را در فرم قرار می‌دهد
    SyncSelectedPerson();
}



/* اگر دقیقا یک نفر انتخاب شده باشد اطلاعاتش و در فرم   
 نمایش میده ، در غیر این صورت فرم و خالی میکنه  
*/
function SyncSelectedPerson() {
    const tableBody = document.getElementById("peopleTableBody");

    const selectedCheckboxes = tableBody.querySelectorAll(
        ".person-checkbox:checked"
    );

    const personId = document.getElementById("personId");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");

    // در صورت انتخاب هیچ‌ کس یا چند نفر، فرم را خالی می‌کند
    if (selectedCheckboxes.length !== 1) {
        personId.value = "";
        firstName.value = "";
        lastName.value = "";
        return;
    }

    const selectedRow = selectedCheckboxes[0].closest("tr");

    personId.value = selectedRow.dataset.id;
    firstName.value = selectedRow.cells[1].textContent.trim();
    lastName.value = selectedRow.cells[2].textContent.trim();
}



/* بعد از عملیات های ادد ، دیلیت و رفرش 
 فرم و آیدی شخص رو پاک میکنه 
*/
function ClearPersonForm() {
    document.getElementById("personForm").reset();
    document.getElementById("personId").value = "";
}