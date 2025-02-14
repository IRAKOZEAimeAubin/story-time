import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /health:
 *  get:
 *     summary: Check server health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 */
router.get( '/', ( req, res ) => {
    res.status( 200 ).json( { status: 'UP' } );
} );

export default router;
