const sendResponse = {
    success: (res, status, result) => {
      const results = {
        status,
        msg: result.msg,
        data: result.data || null,
        meta: result.meta || null,
      };
      return res.status(status).json(results);
    },
    error: (res, status, error) => {
      return res
        .status(status)
        .json({ status, msg: error.msg, data: error.data || null });
    },
  
    response: (res, result) => {
      const { status, error, data, message, meta } = result;
      const resultPrint = {};
      resultPrint.status = message || "success";
      resultPrint.statusCode = status;
      if (meta) {
        resultPrint.meta = meta;
      }
      resultPrint.data = data || null;
      resultPrint.error = error || null;
      res.status(status).json(resultPrint);
    },
  };
  
  module.exports = sendResponse;
  