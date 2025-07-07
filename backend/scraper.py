import requests
from bs4 import BeautifulSoup

def get_restaurants():
    """
    Scrapes restaurant data from Timeout Mumbai and returns a list of restaurant dictionaries.
    Any price that isn’t 'average', 'pricey' or 'bargain' becomes 'Unavailable'.
    """
    url = "https://www.timeout.com/mumbai/restaurants/best-restaurants-in-mumbai"
    VALID_PRICES = {"average", "pricey", "bargain"}

    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/91.0.4472.124 Safari/537.36'
        )
    }

    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()

        # Optional debug: uncomment to inspect the raw HTML
        # print(resp.text[:2000])

        soup = BeautifulSoup(resp.content, 'html.parser')

        # Primary selector: all <article class="tile">
        articles = soup.find_all('article', class_='tile')
        if not articles:
            return {
                "success": False,
                "error": "No <article class='tile'> elements found. The page structure may have changed or content is JS‑rendered.",
                "restaurants": []
            }

        restaurants = []
        for article in articles:
            # — Title —
            h3 = article.find('h3')
            if not h3:
                continue
            raw_title = h3.get_text(strip=True)
            # strip off leading digits + dot
            title = (
                raw_title.split('.', 1)[1].strip()
                if '.' in raw_title and raw_title.split('.', 1)[0].isdigit()
                else raw_title
            )

            # — Image URL —
            img = article.find('img')
            image = img['src'] if img and img.has_attr('src') else None

            # — Description & Price —
            desc_div = article.find('div', {'data-testid': 'summary_testID'})
            description = ""
            price = ""
            if desc_div:
                spans = desc_div.find_all('span')
                if spans:
                    description = spans[0].get_text(strip=True)
                    if len(spans) > 1:
                        price_text = spans[1].get_text(strip=True)
                        price = (
                            price_text.replace("Price:", "").strip()
                            if "Price:" in price_text
                            else price_text.strip()
                        )
                # fallback to <strong> tag for price
                if not price:
                    strong_tag = desc_div.find('strong', string=lambda t: t and 'Price:' in t)
                    if strong_tag:
                        nxt = strong_tag.find_next(string=True)
                        if nxt:
                            price = nxt.strip()

            # — Normalize price —
            price_clean = price.lower()
            if price_clean not in VALID_PRICES:
                price = "Unavailable"
            else:
                price = price_clean.capitalize()

            restaurants.append({
                'title': title,
                'image': image,
                'description': description or "No description available.",
                'price': price
            })

        return {"success": True, "restaurants": restaurants}

    except requests.exceptions.RequestException as err:
        return {"success": False, "error": f"Request error: {err}", "restaurants": []}
    except Exception as err:
        return {"success": False, "error": f"Scraping error: {err}", "restaurants": []}


if __name__ == "__main__":
    result = get_restaurants()
    if result["success"]:
        for i, r in enumerate(result["restaurants"], 1):
            print(f"{i}. {r['title']} — {r['price']}")
            print(f"   Image: {r['image']}")
            print(f"   Desc : {r['description']}\n")
    else:
        print(f"Error: {result['error']}")
