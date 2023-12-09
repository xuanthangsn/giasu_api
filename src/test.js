const db = require("../models/index");

(async () => {
  const arr = []
  const s = await db.Subject.findOne({
    where: {
      name: "invalid",
      grade: 1,
    },
  });

  if (s == null) {
    console.log('s is null');
  }

  console.log(s);
  arr.push(s.id);
})();
