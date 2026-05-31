import { mainStore } from "@/store";
import { throttle } from "lodash-es";

/**
 * 计算滚动高度和滚动百分比
 */
export const calculateScroll = throttle(
  () => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") return false;
      const store = mainStore();
      const scrollY = window.scrollY || window.pageYOffset;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = ((scrollY / totalHeight) * 100).toFixed(0);
      // 判断滚动方向
      const scrollDirection = scrollY > store.scrollData.height ? "down" : "up";
      // 储存计算结果
      store.scrollData = {
        height: Number(scrollY.toFixed(0)),
        percentage: Number(scrollPercentage),
        direction: scrollDirection,
      };
    } catch (error) {
      console.error("计算滚动时出现错误：", error);
    }
  },
  300,
  true,
);

/**
 * 平滑滚动至目标高度或元素
 * @param {number|HTMLElement} target - 目标高度或元素
 */
export const smoothScrolling = (target = 0) => {
  try {
    if (typeof window === "undefined") return false;
    if (typeof target === "number") {
      // 滚动至指定高度
      window.scrollTo({ top: target, behavior: "smooth" });
    } else if (target instanceof HTMLElement) {
      // 滚动至元素
      const top = target.getBoundingClientRect().top - 80;
      window.scrollTo({ top, behavior: "smooth" });
    } else if (typeof target === "string" && target.startsWith("#")) {
      // 滚动至 ID
      const element = document.querySelector(target);
      if (element) {
        const top = element.getBoundingClientRect().top - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      // 滚动至顶部
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("平滑滚动出错：", error);
  }
};

/**
 * 格式化时间戳为相应的日期格式
 * 如果时间戳表示的时间为7天内，则返回 'n天内'
 * 如果时间戳表示的时间为7天之后但在当年，则返回 '月/日'
 * 如果时间戳表示的时间在当年之前，则返回 '年/月/日'
 * @param {number} timestamp - 时间戳（以毫秒为单位）
 * @return {string} 返回日期格式的字符串
 */
export const formatTimestamp = (timestamp) => {
  let now = new Date();
  // 获取今天0点
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // 获取昨天0点
  let yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  let targetDate = new Date(timestamp);
  // 是否为昨天
  if (targetDate >= yesterday && targetDate < today) {
    return "1天前";
  } else {
    let difference = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));
    if (difference <= 0) {
      return "今日内";
    } else if (difference < 7) {
      return `${difference}天前`;
    } else {
      let year = targetDate.getFullYear();
      let month = targetDate.getMonth() + 1;
      let day = targetDate.getDate();
      if (year === now.getFullYear()) {
        return `${month}/${day}`;
      } else {
        return `${year}/${month}/${day}`;
      }
    }
  }
};

/**
 * 计算给定日期与当前日期相差的天数
 * @param {string} dateStr - 要计算差值的日期，为字符串形式
 * @returns {number} 天数差值
 */
export const daysFromNow = (dateStr) => {
  const currentDate = new Date();
  const inputDate = new Date(dateStr);
  const timeDiff = currentDate - inputDate;
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return dayDiff;
};

/**
 * 随机前往一篇文章
 * @param {Object} postData - 文章数据
 * @returns {number} 天数差值
 */
let lastIndex = -1;
export const shufflePost = (postData) => {
  let randomIndex;
  do {
    // 随机生成一个索引值
    randomIndex = Math.floor(Math.random() * postData.length);
  } while (randomIndex === lastIndex && postData.length > 1);
  // 更新上一次的索引值
  lastIndex = randomIndex;
  // 随机文章
  const randomPost = postData[randomIndex];
  console.log(randomPost);
  // 跳转到随机文章
  return randomPost.regularPath;
};

/**
 * 复制文本到剪贴板
 * @param {string} data 要复制到剪贴板的文本
 */
export const copyText = async (data) => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data);
      $message.success("复制成功，在转载时请标注本文地址");
    } catch (error) {
      console.error("复制出错：", error);
      $message.error("复制出现错误，请重试");
    }
  } else {
    // 如果浏览器不支持 navigator.clipboard
    const textArea = document.createElement("textarea");
    textArea.value = data;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      $message.success("复制成功，在转载时请标注本文地址");
    } catch (err) {
      console.error("复制出错：", err);
      $message.error("复制出现错误，请重试");
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

/**
 * 图片 URL 复制到剪贴板
 * @param {string} imageURL 要复制到剪贴板的图片的URL
 */
export const copyImage = async (imageURL) => {
  if (!navigator.clipboard) {
    console.error("浏览器不支持 Clipboard API");
    return;
  }
  try {
    const response = await fetch(imageURL);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
    console.log("图片已复制到剪贴板");
    $message.success("图片已复制到剪贴板");
  } catch (error) {
    console.error("复制图片出错：", error);
    $message.error("复制图片错误，请重试");
  }
};

/**
 * 下载图片
 * @param {string} imageUrl 要下载的图片的URL地址
 */
export const downloadImage = (imageUrl) => {
  try {
    // 获取当前日期并转换为字符串形式，作为文件名
    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    const imageName = `image-${timestamp}.jpg`;
    const anchor = document.createElement("a");
    anchor.download = imageName;
    anchor.href = imageUrl;
    anchor.target = "_blank";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } catch (error) {
    console.error("下载图片出错：", error);
    $message.error("下载图片错误，请重试");
  }
};

/**
 * 获取根据当前时间的问候语
 * @returns {string} 当前时间对应的问候语
 */
export const getGreetings = () => {
  const hour = new Date().getHours();
  let hello;
  if (hour < 6) {
    hello = "凌晨好，昨晚睡得怎么样？";
  } else if (hour < 9) {
    hello = "早上好，今天也要开心哦！";
  } else if (hour < 12) {
    hello = "上午好，今天也要加油哦！";
  } else if (hour < 14) {
    hello = "中午好，吃饱了精神好！";
  } else if (hour < 17) {
    hello = "下午好，继续加油！";
  } else if (hour < 19) {
    hello = "傍晚好，是时候放松一下了！";
  } else if (hour < 22) {
    hello = "晚上好，是时候休息了！";
  } else {
    hello = "夜深了，明天继续加油！";
  }
  return hello;
};

// 打乱数组 - Fisher-Yates 洗牌算法
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // 解构赋值进行元素互换
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 节假日主题色
export const holidayThemeColor = () => {
  const holidays = [
    // date: MM-DD, 支持单个日期或日期范围 MM-DD~MM-DD
    { date: "1-1~1-3", name: "元旦", light: "#e74c3c", dark: "#ff6b6b" },
    { date: "1-25~2-10", name: "春节", light: "#e74c3c", dark: "#ff6b6b" },
    { date: "2-14", name: "情人节", light: "#e91e63", dark: "#ff6b9d" },
    { date: "3-8", name: "妇女节", light: "#e91e63", dark: "#ff6b9d" },
    { date: "4-1", name: "愚人节", light: "#f39c12", dark: "#f1c40f" },
    { date: "5-1~5-5", name: "劳动节", light: "#e74c3c", dark: "#ff6b6b" },
    { date: "6-1", name: "儿童节", light: "#27ae60", dark: "#2ecc71" },
    { date: "6-15~6-22", name: "端午节", light: "#27ae60", dark: "#2ecc71" },
    { date: "8-15~8-20", name: "中秋节", light: "#f39c12", dark: "#f1c40f" },
    { date: "9-10", name: "教师节", light: "#3498db", dark: "#5dade2" },
    { date: "10-1~10-7", name: "国庆节", light: "#e74c3c", dark: "#ff6b6b" },
    { date: "10-31", name: "万圣节", light: "#f39c12", dark: "#f1c40f" },
    { date: "12-24~12-26", name: "圣诞节", light: "#27ae60", dark: "#2ecc71" },
  ];

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const currentDate = `${month}-${day}`;

  const isInRange = (dateStr) => {
    if (dateStr.includes("~")) {
      const [start, end] = dateStr.split("~");
      const [sM, sD] = start.split("-").map(Number);
      const [eM, eD] = end.split("-").map(Number);
      const curr = month * 100 + day;
      return curr >= sM * 100 + sD && curr <= eM * 100 + eD;
    }
    return dateStr === currentDate;
  };

  const holiday = holidays.find((h) => isInRange(h.date));
  if (holiday) {
    const root = document.documentElement;
    root.style.setProperty("--main-color", holiday.light);
    root.style.setProperty("--main-color-bg", holiday.light + "20");

    // 暗色模式覆盖
    const darkStyle = document.createElement("style");
    darkStyle.id = "holiday-dark-theme";
    darkStyle.textContent = `
      html.dark { --main-color: ${holiday.dark}; --main-color-bg: ${holiday.dark}23; }
    `;
    // 移除旧的
    const oldStyle = document.getElementById("holiday-dark-theme");
    if (oldStyle) oldStyle.remove();
    document.head.appendChild(darkStyle);

    if (typeof $message !== "undefined") {
      $message.info(`${holiday.name}快乐！主题色已切换为节日限定 🎉`, {
        duration: 5000,
        close: true,
      });
    }
  }
};

// 特殊纪念日置灰
export const specialDayGray = () => {
  const specialDays = [
    { date: "4-4", name: "清明节" },
    { date: "5-12", name: "汶川大地震纪念日" },
    { date: "7-7", name: "中国人民抗日战争纪念日" },
    { date: "9-18", name: "九·一八事变纪念日" },
    { date: "12-13", name: "南京大屠杀死难者国家公祭日" },
  ];
  // 获取当天日期
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const currentDate = `${month}-${day}`;
  // 查找纪念日
  const specialDay = specialDays.find((day) => day.date === currentDate);
  if (specialDay) {
    document.documentElement.classList.add("gray");
    if (typeof $message !== "undefined") {
      $message.info(`今天是${specialDay.name}，特此默哀`, {
        duration: 8000,
        close: true,
      });
    }
  }
};
