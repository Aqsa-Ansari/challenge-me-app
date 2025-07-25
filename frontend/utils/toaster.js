export const showToast = (message, type = "success", duration = 3000) => {
    const toast = document.createElement("div");

    const baseClasses =
        "px-4 py-2 rounded shadow-md text-white text-sm flex items-center gap-2";
    const typeClasses =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-gray-700";

    toast.className = `${baseClasses} ${typeClasses}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="ml-auto text-white hover:opacity-70" onclick="this.parentElement.remove()">×</button>
    `;

    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}