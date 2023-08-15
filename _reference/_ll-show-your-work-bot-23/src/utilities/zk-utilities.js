
//corgis

const corgiImages = [
    "https://www.akc.org/wp-content/uploads/2017/11/Pembroke-Welsh-Corgi-standing-outdoors-in-the-fall.jpg",
    "https://cdn.akc.org/Marketplace/Breeds/Pembroke_Welsh_Corgi_SERP.jpg",
    "https://pbs.twimg.com/media/ET0I1GQWAAgWF8q.jpg",
    "https://www.keystonepuppies.com/wp-content/uploads/2018/10/Welsh-Corgi-Category-1024x707.jpg",
    "https://rusticbarnkennels.com/wp-content/uploads/2019/12/IMG_8920_1200x800_900x600.jpg",
    "https://gfp-2a3tnpzj.stackpathdns.com/wp-content/uploads/2016/07/Pembroke-Welsh-Corgi-2-1600x700.jpg",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3f60680f-cb58-4b2f-b517-97f575986b5c/dapbzax-f1190592-7e29-47b3-98f9-e241049887f0.jpg/v1/fill/w_1024,h_725,q_75,strp/astronaut_corgi_by_hkxdesign_dapbzax-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzI1IiwicGF0aCI6IlwvZlwvM2Y2MDY4MGYtY2I1OC00YjJmLWI1MTctOTdmNTc1OTg2YjVjXC9kYXBiemF4LWYxMTkwNTkyLTdlMjktNDdiMy05OGY5LWUyNDEwNDk4ODdmMC5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.sGlvKs9GF5Zj43b8WcaNOCymiEP3vUWbV0q7Un3SQ1c",
    "https://ih1.redbubble.net/image.590734664.7177/flat,750x,075,f-pad,750x1000,f8f8f8.u1.jpg",
    "https://i.pinimg.com/originals/ee/64/d7/ee64d7f46a5f2d5250f82087446aa641.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNnFrRv58zUOqizYTURyGTyBb6iASxAvQHEw&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZiHO39LKykEHwM1nfJzd_fVmke8GDSxV7TQ&usqp=CAU",
    "https://pbs.twimg.com/media/D6jThaGW0AIL86y?format=jpg&name=4096x4096",
    "https://i.pinimg.com/736x/37/07/9c/37079c0a857e84488b32d03f289c60a8--vikings-mixed-media.jpg",
    "https://i.chzbgr.com/full/6227538688/hF729D494/good-ship-corgi",
    "https://64.media.tumblr.com/a66e4c727216c1fbf6ab6bd26011b974/tumblr_ov5sm3xJLp1qbwakso1_500.jpg",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a4ecfa7b-4613-4b98-8e31-c94fb7f580e5/d9fw4cl-82ab3997-abb7-41c9-8d2c-b156f31e2134.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E0ZWNmYTdiLTQ2MTMtNGI5OC04ZTMxLWM5NGZiN2Y1ODBlNVwvZDlmdzRjbC04MmFiMzk5Ny1hYmI3LTQxYzktOGQyYy1iMTU2ZjMxZTIxMzQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.-a5RU4Opa-mVcC17vVK4rHnnzyUOiSJk9EoKABlQ1CY",
    "https://ftw.usatoday.com/wp-content/uploads/sites/90/2021/12/Screen-Shot-2021-12-26-at-2.47.30-PM.jpg?w=1000&h=495&crop=1"
]

exports.corgi = async ({ command, ack, say }) => {
    ack();
    var randomCorgi = corgiImages[Math.floor(Math.random()*corgiImages.length)];
    say({
        blocks: [
            {
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "corgi",
                    "emoji": true
                },
                "image_url": randomCorgi,
                "alt_text": "corgi"
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "this is corgi :dog: corgi gud??????? the corgis worked very hard to get this image of a corgi dog. appreciate their efforts now. the aliens helped them get to earth on a ufo, and the corgis crash landed on earth. they landed in a tennis ball factory. save a corgi at www . saveacorgi . com . this is not an actual link. :sunglasses: also this was made by zibby. very epic and cool. :sunglasses: :squirrel:"
                }
            }
        ]
    })
}