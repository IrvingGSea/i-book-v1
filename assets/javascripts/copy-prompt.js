document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".admonition.prompt").forEach((admonition) => {
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.className = "copy-button";
        admonition.appendChild(copyButton);

        copyButton.addEventListener("click", () => {
            const promptText = Array.from(admonition.querySelectorAll("p:not(.admonition-title)"))
                .map((p) => p.textContent.trim())
                .join("\n");

            if (promptText) {
                navigator.clipboard.writeText(promptText).then(
                    () => {
                        copyButton.textContent = "Copied!";
                        setTimeout(() => (copyButton.textContent = "Copy"), 2000);
                    },
                    (err) => console.error("Failed to copy text: ", err)
                );
            } else {
                console.error("No prompt text found to copy.");
            }
        });
    });
});
