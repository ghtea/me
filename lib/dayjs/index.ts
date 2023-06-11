import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // import plugin
import "dayjs/locale/ko";

dayjs.extend(relativeTime);

export { dayjs };
