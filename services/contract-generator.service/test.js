const { generatePdfContract } = require("./index");
const path = require("path");

const outputPath = path.join(__dirname, "contract.pdf");
const content = {
  tutor: {
    name: "Tran Xuan Thang",
    phone: "0962597636",
    birth: "26/12/2002",
    address: "So 18, ngo 150, pho Hoa Bang, Yen Hoa, Cau Giay, Ha Noi",
    job: "Sinh vien UET",
  },
  parent: {
    name: "Nguyen Le Tuong Vy",
    phone: "0822696769",
    address: "Phuong 8, Vinh Long",
  },
  class: {
    subject: "Sinh hoc 8",
    schedule: "2b/tuan",
    price: "200k/buoi",
    time_per_day: "3h/buoi",
  },
};
    

(async () => {
  await generatePdfContract(outputPath, content);
  console.log("Successfully generate pdf contract");
})();
