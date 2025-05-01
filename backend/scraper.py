import requests
from bs4 import BeautifulSoup

def get_restaurants():
    """
    Scrapes restaurant data from Timeout Mumbai and returns a list of restaurant dictionaries.
    Any price that isn’t 'average', 'pricey' or 'bargain' becomes 'Unavailable' .
    """
    url = "https://www.timeout.com/mumbai/restaurants/best-restaurants-in-mumbai"
    VALID_PRICES = {"average", "pricey", "bargain"}

    try:
        # Making the HTTP request with a user agent to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                          'AppleWebKit/537.36 (KHTML, like Gecko) '
                          'Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10) # sends get request to the URL and wait upto 10 seconds before sending again 
        response.raise_for_status()  # if server returned an error code (like 404 or 500), this will raise an exception.

        # Parse HTML using beautfifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # searches for div tag whose class attribute is _zoneItems_w0pgc_1 zoneItems thats where all the restaurant data is present
        zone = soup.find('div', {'class': "_zoneItems_w0pgc_1 zoneItems"})
        if not zone: #incase the structure changes or not able to find the div
            return {"success": False, "error": "Could not find restaurant listings", "restaurants": []}

        restaurants = [] # storing restaurant data

        for article in zone.find_all('article', class_='tile'): # loops over all the article class = tile
            # — Title —
            h3 = article.find('h3', class_='_h3_19kvp_1') # extracting title , all title have same class 
            if not h3:
                continue # skip this tile if no title dound
            raw_title = h3.get_text(strip=True)
            # strip off any leading "1." or "2." etc.
            title = raw_title.split('.', 1)[1].strip() if '.' in raw_title and raw_title.split('.', 1)[0].isdigit() else raw_title

            # — Image URL —
            img = article.find('img', class_='aspect-ratio-16-9')
            image = img['src'] if img and img.has_attr('src') else None

            # — Description & Price —
        
            # find all spans in div class data-test-id first span is description and second span is price
            
            desc_div = article.find('div', {'data-testid': 'summary_testID'})
            description = ""
            price = ""
            if desc_div:
                spans = desc_div.find_all('span')
                if spans:
                    description = spans[0].get_text(strip=True)
                    if len(spans) > 1:
                        price_text = spans[1].get_text(strip=True)
                        price = price_text.replace("Price:", "").strip() if "Price:" in price_text else price_text.strip()

                # fallback if still empty
                # sometimes when the price is not present in the span tag look for price in strong tag 
                if not price:
                    strong_tag = desc_div.find('strong', string=lambda t: t and 'Price:' in t)
                    if strong_tag:
                        nxt = strong_tag.find_next(string=True)
                        if nxt:
                            price = nxt.strip()

            # normalize price
            # sometimes it fetches prices as thaali , or any other text due to unusual structure in such cases make it unavailable
            price_clean = price.lower()
            if price_clean not in VALID_PRICES:
                price = "Unavailable"
            else:
                # capitalize to "Average", "Pricey", "Bargain"
                price = price_clean.capitalize()

            # build data
            restaurants.append({
                'title': title,
                'image': image,
                'description': description or "No description available.",
                'price': price
            })

        return {"success": True, "restaurants": restaurants} # return data

    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"Request error: {e}", "restaurants": []} # incase of error in request library
    except Exception as e:
        return {"success": False, "error": f"Scraping error: {e}", "restaurants": []} # any other unexpected outcome


if __name__ == "__main__":
    result = get_restaurants()
    if result["success"]:
        for i, r in enumerate(result["restaurants"], 1):
            print(f"{i}. {r['title']} — {r['price']}")
            print(f"   Image: {r['image']}")
            print(f"   Desc : {r['description']}\n")
    else:
        print(f"Error: {result['error']}")
