import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      time_stamp: Date.now(),
      message:"Assignment_Ragilly server up and running"
    });
  } catch (err) {
    res.json({ Error: err });
  }
});

export default router;