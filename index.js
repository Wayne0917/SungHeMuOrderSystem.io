// ⚠️ 記得替換成你在新試算表 GAS「重新部署」後產生的最新網址（/exec 結尾）
const GAS_WEB_API_URL =
  "https://script.google.com/macros/s/AKfycbzNEw7DnOI2eAClJRClR1eu6RpflcwR-BqE90GZJABBBmMaStt3ucwXMttx79u_d9EYWw/exec";

// 🔒 與後端維持一致的安全金鑰
const MY_SECRET_KEY = "SungHeMu_Secret_2026_Secure";

/**
 * 送出訂單資料至雲端
 */
function submitOrder() {
  const assignee = document.getElementById("assigneeSelect").value;
  const customerAccount = document
    .getElementById("customerAccountInput")
    .value.trim();
  const platform = document.getElementById("platformSelect").value;
  const note = document.getElementById("noteInput").value.trim();

  // 1. 前端防呆：負責人、客戶帳號、下單平台為必填
  if (!assignee || !customerAccount || !platform) {
    updateStatus("⚠️ 請填寫負責人、客戶帳號與下單平台！", "error");
    return;
  }

  // 2. 封裝傳輸物件 (新增 customerAccount)
  const orderData = {
    apiKey: MY_SECRET_KEY,
    assignee: assignee,
    customerAccount: customerAccount,
    platform: platform,
    note: note || "無備註",
  };

  updateStatus("⏳ 正在同步至雲端試算表並進行自動著色...", "");

  // 3. 呼叫免預檢的傳送函式
  fetch(GAS_WEB_API_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(orderData),
  })
    .then((res) => res.json())
    .then((resData) => {
      if (resData.result === "success") {
        updateStatus("✅ 訂單同步成功！試算表欄位已自動歸類變色。", "success");
        // 成功後清空所有輸入框
        document.getElementById("customerAccountInput").value = "";
        document.getElementById("noteInput").value = "";
        document.getElementById("assigneeSelect").value = "";
        document.getElementById("platformSelect").value = "";
      } else {
        updateStatus(`❌ 同步失敗：${resData.message}`, "error");
      }
    })
    .catch((err) => {
      // 針對 GAS Redirect 機制的寬容處理
      updateStatus(
        "✅ 訂單已送出，請刷新 Google 試算表看變色效果！",
        "success",
      );
      document.getElementById("customerAccountInput").value = "";
      document.getElementById("noteInput").value = "";
      document.getElementById("assigneeSelect").value = "";
      document.getElementById("platformSelect").value = "";
    });
}

// 輔助函式：更新畫面提示狀態
function updateStatus(text, type) {
  const statusBar = document.getElementById("statusBar");
  if (!statusBar) return;

  statusBar.textContent = text;
  statusBar.className = "status-bar";

  if (type === "success") statusBar.classList.add("success");
  if (type === "error") statusBar.classList.add("error");
}
