# Stockbreech

A small stock website I created using HTML and Javascript, tracks 16 stocks automatically and updates stock information every 6 hours. Runs completely on it's own using Finnhub and Github Actions.

# Reason for Creation / How it Works

I created Stockbreech as a small introduction website to myself on how I can create a backend. A bad one, at that, but at least it works. I am also interested in the stock market, but I'm just a *little* too dumb to understand those hyper complex websites everyone uses. To make it something I understand, I created Stockbreech in an attempt to make it just a bit easier for people like me to understand. 

## database and backend
Using my Finnhub API key, it loads a majority of the database that Finnhub uses, having all the base information the website needs at the current point in time, then grabs (or fetches, I use the term grab) the select 16 tickers from the database, and records it into a dedicated database file (called stock-data.json). Once the process happens 16 times and all the tickers have gotten an update, the process will end and the website is updated. In the event something goes wrong, the database does not update and I am sent a warning (whether I like it or not) via Github Actions email. Oh yeah, and loading *can* be slow sometimes since every now and then it'll wait 3 seconds to stay within rate limits.

<img width="929" height="60" alt="An image of the backend that shows the tickers active and the filepath." src="https://github.com/user-attachments/assets/b9dcb27f-8f78-41f6-aaf0-e8bbfd9fecc2" />


## frontend
The frontend, obviously, is way simpler than the backend.

<img width="1001" height="487" alt="An image of the frontend of stockbreech." src="https://github.com/user-attachments/assets/91e1ae71-8105-4e6d-b1e3-ddcf8d194683" />

Let's rapid-fire overview the functions and usage of the frontend features, and how it works.

- The Spot Price is the active price that was given via the variable "c" (for current) ever since the last update. Naturally pulls this data from the backend.
- The Upper and Lower framework is tracked via the variables "h" and "l" (indicating Higher and Lower respectively). It indicates the lowest and highest point of a stock on a certain day. At least it should. Data naturally given from backend.
- The Assessment is simple. It uses basic math and tracks if a line is either going up or down. If the math is **exceeding** a limit, it will be marked as Excelling, and will judge whether if it's a small excel or large excel depending on how sharp the range is. Same thing goes for **ejecting.** If the math is **going down** the limit, it will be marked as Ejecting, and using the same formula, judge whether if it's a large or small decline. This data is not given from the backend (mainly cuz the backend is there just for the stock data and not calculations).
- The memo is simple text logs using your browser's localdata (sorry to browsers that erase localdata constantly). It reads text input given on the left box, saves that text, but also tracks the current stock price in that moment before saving. It's stored in your "system manifest," which is essentially, as I just said, your local data. It does get the date from your browser/system's current active date, and grabs stock price from variables, so technically it does not use the backend. The memo is saved to the middle console, where it shows that data visibly, that being the manifest I just talked about. Every single memo you wrote can be wiped with a simple button by simply purging the data active.
- The Currency Translator is simple math. It uses base formulas to translate currency (such as  ## * 137% for example, the forumla used to translate USD to the canadian dollar) and is essentially just an incredibly simplified pre-determined calculator.
- The Graph uses the data given from the backend, specifically the Spot Price data ("c" or currentprice), and uses that to make dots on a graph using the "stock-data.json" file. In fact, stock-data.json is created mostly just for the graph, as it keeps all the values from previous times and dates. Sadly, like the bum I am, I had to get my mom to assist me with the whole chart system (mainly getting it to show visually), but I am aware that it uses "globalchartinstance" to keep track of a majority of the graph's visuals.

## stockmarker
Stockmarker is the clicker game you can find in the bottom left corner of the website.

<img width="163" height="92" alt="image of the button at the bottom left of the screen" src="https://github.com/user-attachments/assets/55e081a0-29b3-4b3d-b940-dbcaa3e4c443" />

It's a pretty basic clicker game, with upgrades and achivements and all. Not gonna lie, I kinda put more time into the clicker game than most of the frontend since i had to run this one a bit more solo. It does change the style of the website slightly after you reach 1K points or reach 2x mult. The game is actually it's own independent part of the website, requiring no backend, frontend help, or anything. The graph was created similar to how the main graph was made on the frontend, but updated every change of the score rather than at select intervals.

I'd say this part of the website is more enjoyable than the website as a whole... which, also, there's no data saving. Don't close the tab if you went far, or else that time would be wasted.

# Attributions/Credits
- **FINNHUB API**, is the core backend of this project, and this project would not exist without it.
- My mom, a really good backend developer, helped make the backend work and helped assist me when I needed it the most.
- My CS Teacher, who teaches HTML and Javascript, helped assist with the frontend and supply me with learning materials to help get this project done.

