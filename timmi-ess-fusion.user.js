// ==UserScript==
// @name         Timmi ESS Fusion
// @namespace    https://github.com/draganignjic/timmi-ess-fusion/
// @version      0.8.10
// @description  Embed ESS Timesheet in Lucca Timmi
// @author       Dragan Ignjic (Saferpay)
// @include      /ZCA_TIMESHEET
// @include      /sps.ilucca.ch/timmi
// @include      /sap/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addValueChangeListener
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment-with-locales.min.js
// @downloadURL  https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/timmi-ess-fusion.user.js
// @updateURL    https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/timmi-ess-fusion.user.js
// ==/UserScript==

(async () => {

    let _updateUrl = "https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/timmi-ess-fusion.user.js";
    let _essLoginUrl = "https://www.corp.worldline.com//irj/portal?NavigationTarget=navurl%3A%2F%2F84bc02facde559823f00891e66f3af77&atosStandaloneContent=yes&CurrentWindowId=WID1578481318556&supportInitialNavNodesFilter=true&filterViewIdList=%3BAtosEndUser%3B&PrevNavTarget=navurl%3A%2F%2F7eb1a7e6f0945a01676a229d623d6c8f&TarTitle=Timesheet%20entry&NavMode=10";
    let _essLegacyLoginUrl = "https://www.corp.worldline.com/irj/portal?NavigationTarget=navurl%3A%2F%2F84bc02facde559823f00891e66f3af77&atosStandaloneContent=yes&CurrentWindowId=WID1580893319809&supportInitialNavNodesFilter=true&filterViewIdList=%3BAtosEndUser%3B&PrevNavTarget=navurl%3A%2F%2F7eb1a7e6f0945a01676a229d623d6c8f&TarTitle=Timesheet entry&NavMode=10";
    let _essStartUrl = "https://perf.corp.worldline.com/sap(ZT16N2x3UWs5WFNRYU8xWHlDOU5fcU13LS1USHhuanBBcmVRYnE3MEg5RjlvWUJRLS0=)/bc/bsp/sap/ZCA_TIMESHEET/timeout.html";
    let _saferpayLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAcCAYAAACqAXueAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAAKL2lDQ1BJQ0MgUHJvZmlsZQAASMedlndUVNcWh8+9d3qhzTACUobeu8AA0nuTXkVhmBlgKAMOMzSxIaICEUVEmiJIUMSA0VAkVkSxEBRUsAckCCgxGEVULG9G1ouurLz38vL746xv7bP3ufvsvc9aFwCSpy+XlwZLAZDKE/CDPJzpEZFRdOwAgAEeYIApAExWRrpfsHsIEMnLzYWeIXICXwQB8HpYvAJw09AzgE4H/5+kWel8geiYABGbszkZLBEXiDglS5Auts+KmBqXLGYYJWa+KEERy4k5YZENPvsssqOY2ak8tojFOaezU9li7hXxtkwhR8SIr4gLM7mcLBHfErFGijCVK+I34thUDjMDABRJbBdwWIkiNhExiR8S5CLi5QDgSAlfcdxXLOBkC8SXcklLz+FzExIFdB2WLt3U2ppB9+RkpXAEAsMAJiuZyWfTXdJS05m8HAAW7/xZMuLa0kVFtjS1trQ0NDMy/apQ/3Xzb0rc20V6Gfi5ZxCt/4vtr/zSGgBgzIlqs/OLLa4KgM4tAMjd+2LTOACApKhvHde/ug9NPC+JAkG6jbFxVlaWEZfDMhIX9A/9T4e/oa++ZyQ+7o/y0F058UxhioAurhsrLSVNyKdnpDNZHLrhn4f4Hwf+dR4GQZx4Dp/DE0WEiaaMy0sQtZvH5gq4aTw6l/efmvgPw/6kxbkWidL4EVBjjIDUdSpAfu0HKAoRINH7xV3/o2+++DAgfnnhKpOLc//vN/1nwaXiJYOb8DnOJSiEzhLyMxf3xM8SoAEBSAIqkAfKQB3oAENgBqyALXAEbsAb+IMQEAlWAxZIBKmAD7JAHtgECkEx2An2gGpQBxpBM2gFx0EnOAXOg0vgGrgBboP7YBRMgGdgFrwGCxAEYSEyRIHkIRVIE9KHzCAGZA+5Qb5QEBQJxUIJEA8SQnnQZqgYKoOqoXqoGfoeOgmdh65Ag9BdaAyahn6H3sEITIKpsBKsBRvDDNgJ9oFD4FVwArwGzoUL4B1wJdwAH4U74PPwNfg2PAo/g+cQgBARGqKKGCIMxAXxR6KQeISPrEeKkAqkAWlFupE+5CYyiswgb1EYFAVFRxmibFGeqFAUC7UGtR5VgqpGHUZ1oHpRN1FjqFnURzQZrYjWR9ugvdAR6AR0FroQXYFuQrejL6JvoyfQrzEYDA2jjbHCeGIiMUmYtZgSzD5MG+YcZhAzjpnDYrHyWH2sHdYfy8QKsIXYKuxR7FnsEHYC+wZHxKngzHDuuCgcD5ePq8AdwZ3BDeEmcQt4Kbwm3gbvj2fjc/Cl+EZ8N/46fgK/QJAmaBPsCCGEJMImQiWhlXCR8IDwkkgkqhGtiYFELnEjsZJ4jHiZOEZ8S5Ih6ZFcSNEkIWkH6RDpHOku6SWZTNYiO5KjyALyDnIz+QL5EfmNBEXCSMJLgi2xQaJGokNiSOK5JF5SU9JJcrVkrmSF5AnJ65IzUngpLSkXKabUeqkaqZNSI1Jz0hRpU2l/6VTpEukj0lekp2SwMloybjJsmQKZgzIXZMYpCEWd4kJhUTZTGikXKRNUDFWb6kVNohZTv6MOUGdlZWSXyYbJZsvWyJ6WHaUhNC2aFy2FVko7ThumvVuitMRpCWfJ9iWtS4aWzMstlXOU48gVybXJ3ZZ7J0+Xd5NPlt8l3yn/UAGloKcQqJClsF/hosLMUupS26WspUVLjy+9pwgr6ikGKa5VPKjYrzinpKzkoZSuVKV0QWlGmabsqJykXK58RnlahaJir8JVKVc5q/KULkt3oqfQK+m99FlVRVVPVaFqveqA6oKatlqoWr5am9pDdYI6Qz1evVy9R31WQ0XDTyNPo0XjniZek6GZqLlXs09zXktbK1xrq1an1pS2nLaXdq52i/YDHbKOg84anQadW7oYXYZusu4+3Rt6sJ6FXqJejd51fVjfUp+rv09/0ABtYG3AM2gwGDEkGToZZhq2GI4Z0Yx8jfKNOo2eG2sYRxnvMu4z/mhiYZJi0mhy31TG1Ns037Tb9HczPTOWWY3ZLXOyubv5BvMu8xfL9Jdxlu1fdseCYuFnsdWix+KDpZUl37LVctpKwyrWqtZqhEFlBDBKGJet0dbO1husT1m/tbG0Edgct/nN1tA22faI7dRy7eWc5Y3Lx+3U7Jh29Xaj9nT7WPsD9qMOqg5MhwaHx47qjmzHJsdJJ12nJKejTs+dTZz5zu3O8y42Lutczrkirh6uRa4DbjJuoW7Vbo/c1dwT3FvcZz0sPNZ6nPNEe/p47vIc8VLyYnk1e816W3mv8+71IfkE+1T7PPbV8+X7dvvBft5+u/0erNBcwVvR6Q/8vfx3+z8M0A5YE/BjICYwILAm8EmQaVBeUF8wJTgm+Ejw6xDnkNKQ+6E6ocLQnjDJsOiw5rD5cNfwsvDRCOOIdRHXIhUiuZFdUdiosKimqLmVbiv3rJyItogujB5epb0qe9WV1QqrU1afjpGMYcaciEXHhsceiX3P9Gc2MOfivOJq42ZZLqy9rGdsR3Y5e5pjxynjTMbbxZfFTyXYJexOmE50SKxInOG6cKu5L5I8k+qS5pP9kw8lf0oJT2lLxaXGpp7kyfCSeb1pymnZaYPp+umF6aNrbNbsWTPL9+E3ZUAZqzK6BFTRz1S/UEe4RTiWaZ9Zk/kmKyzrRLZ0Ni+7P0cvZ3vOZK577rdrUWtZa3vyVPM25Y2tc1pXvx5aH7e+Z4P6hoINExs9Nh7eRNiUvOmnfJP8svxXm8M3dxcoFWwsGN/isaWlUKKQXziy1XZr3TbUNu62ge3m26u2fyxiF10tNimuKH5fwiq5+o3pN5XffNoRv2Og1LJ0/07MTt7O4V0Ouw6XSZfllo3v9tvdUU4vLyp/tSdmz5WKZRV1ewl7hXtHK30ru6o0qnZWva9OrL5d41zTVqtYu712fh9739B+x/2tdUp1xXXvDnAP3Kn3qO9o0GqoOIg5mHnwSWNYY9+3jG+bmxSaips+HOIdGj0cdLi32aq5+YjikdIWuEXYMn00+uiN71y/62o1bK1vo7UVHwPHhMeefh/7/fBxn+M9JxgnWn/Q/KG2ndJe1AF15HTMdiZ2jnZFdg2e9D7Z023b3f6j0Y+HTqmeqjkte7r0DOFMwZlPZ3PPzp1LPzdzPuH8eE9Mz/0LERdu9Qb2Dlz0uXj5kvulC31OfWcv210+dcXmysmrjKud1yyvdfRb9Lf/ZPFT+4DlQMd1q+tdN6xvdA8uHzwz5DB0/qbrzUu3vG5du73i9uBw6PCdkeiR0TvsO1N3U+6+uJd5b+H+xgfoB0UPpR5WPFJ81PCz7s9to5ajp8dcx/ofBz++P84af/ZLxi/vJwqekJ9UTKpMNk+ZTZ2adp++8XTl04ln6c8WZgp/lf619rnO8x9+c/ytfzZiduIF/8Wn30teyr889GrZq565gLlHr1NfL8wXvZF/c/gt423fu/B3kwtZ77HvKz/ofuj+6PPxwafUT5/+BQOY8/xvJtwPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJAElEQVRoQ+2aB6wVRRSG3zOAYgOlKFaK2AV714ggiKIRxYq9RYwtajQGKyZqLFHsYMUoWBEp1iBEwRI1FlSwAlFUsAH2+vy/3XOuc5e55d1LeCX8yZedOTu7d3fP1DO3phHrQjuGutiO1egSOzZK1dXVLVUaq1qK39Nknip54uFizzRZs5b4JE02TsWcVA0r2H03ESuLrZJcvjYX66XJRBvZEXWzIwrTawquc60kuD+2NTBIrcXWaTInnqdHmiyq7e2Iwt9F2fxqYhfh79DBjtnfRluKTmmy+YgP+oH4SzwknhEI+z+CFvC1uFasIrwVbSZI0yoQ6VbiCnGnGC2eFuhUMUVwf+wnin/FreId0ULgiPfNxrlCLZhnukXMFDhrvOgn0NHi+jSZ6BjxheD9ZguelXv8IR4QLwrEe/H+lwrOHycaRLFWWA0IRz6fpFK9LrYQdwk+EFpRpKVTpx0phohJ4gSxk3hCtBN0gTgMqBi0FBx8t3DNF1QGynCPo8Tp4nKBqDyFHEzvgG4XxwuuHYtBekrsnCZzul/wvMgd7D3Xx6KNuFLwPjxPX0FlbBDFnFQN/qK1dkRri/VFF/EZBokaj+PovnDwYEEtpxX0F3wUWtIGgq6QljFRvCJocWiOHaksHQVlcO6fgvtvKBYI9KkdY/rBjusKfu8Rwe/jKLrn10SoX4RXThc9BPpRMHRwn3MFFf1MMVc0C7mDe9oR8UFwBl2aj1PtRXdBi8TB+ws+DB93kDhITBBc96VgUrOvOETMEMg/Ms6cJw4TdK0DBa3/O0GlQrG5gMvnAIsFv0cFelg8Jh4XWf0s6IJdb9kxFO86QuwtDhD0DM1GdNE/Ccag6eIqgZh4vS1oidT4w4WLcfPGNJk4+dk0mYhlCM68x45tBV30UOE6SeAYxmrK7CaoRG+KRwWtOtvqEDaek9/Doa4+gnNMkrI6QnDub+FdtIs0vRKt/znBu3Dfj0SDKNbNVgPCwa8mqXR5khUOqkQ+VhZTrAyORrFnceGQUDsIhoNCKvcdmNlX+r5LRTEnVYN30XSPiNaR1UI71lc+VhZTrEyxZ3EtsqOLOcGYNBlVue/wm6j0fRulavHycjVfeQuOqra2tq3oIWJjW1nStT3FdLFIzBdMqpZrGSnqYDmhlWDdyjLiXTFD+e+Er1Pro2vErmJ1wfKIZViTlb4Blf4vUVcEzvtcokFVqAU/KJjpItarTGAIYuyBoVzpJbk/yyV0lIYDhoQ7LL9cy0BLONhq3qFprmakHNJbsIxhOTE5sQZS+TZiA0EUKCuCEa5v7JgnXUeLiF2bJ5XpIAhnLiHsomgMWefXEuXM7ItK32KhaCmorASIpqZnaqa6zc77ZLGk9FytxXqCmH1JqRyBqDzJ1lEs+R31IHlIBD1IwPnZ845E+O9lK+dME/3tvMd1Q1hvt7HzpwkiRn6OOPQ+wf2pZCRYmzI0JOXsHPFqEoQXGQJYp5Mn9HhgcA8q623iW5FcLwh8XGPn6V1wxK9ix+A6lmFUyO9F8j6FkAhrkpiSsa8qiBUQC8fAM9wn2gZlCPQQOCLj8B1OCMr4dyCYQ/SQiCJ5nu9kQViX/QO/nnh/i9z1ngiReGm/gMD+ppEyxJNJUIMJDvg1M+38RZbPQqjynCBPzJsNCM93t+v9xVgS+bl/7Zw72B33lR2dzlbOf4ePMk4QIPEyfBxqPJWO/HVcY9cR3yax2G2FkAo5+A2zzxYs4ViC5ZWTCCyR4IgDZ1meCtfRyvh3wMbRK7NDwIijB4fgktxveCJEonV5YYdQ3gpBmQvEhkGeLTkv28lsXQNbL7MRwCDmTGZQcD0RMxI3Wd5fDKhEe4k97Zw7GM4yW6/AdrXZthEHkXYkwq0khlt+pOXnBmW8wo1yWyGkJRwsEb4lwSQ1abESKxESsLXZiHv3CK5jAupl9jBb+B3uFYSI2Y1zG73MYCvrPeq03D09kUXaVtA9knEmR8qxx9tbnC28XPLQUujg3czGfd12maCiwEtmG2vlwhdLWrUjuYPfzNj5oCTGZezrCHa8iJmzGYFxtJ2j4pAAr4TeSgaG94khxRxM10yCUC9xbcdbca5iW3nCwjwHARsMcLCdC7/D/13v/z3mkMBGmJnErJzNE4WQmGCxhUgG+pidLu5zs2Up5uDwJWKMt3LRF7NzhRz8pNlftTxLM3asyGQZE1zHfjEJlob7Wbpk9wxSzMHhmBhjgJVj0+Y9s2Up5WCfv5wW2GgwJHIOLhroQCrE+MBkxrWJZmu0WsZOdn+46Y7C/xZTSr4liNi7Ze/ZYaw/UMdK5TFq35pkOxOH0ZIGCHaL2FTIysOcbKiwOYGoLJXKVwyM+XyjkPX1jhP1DdkPZ1hi5+xmQUMK/y1TrnzrM1Ru+ze2TDpWDBVh0J0NCRcbE76NqGetGyaYUBCoL0f+8dHGuvbDgPru4myn50z+faEja3TGYcRkBflzfqR7TxK0NiZVWTHmIma+7mAmZZWKHgHx+yyr5jjK+/LJnw2N0DliDbFnq066cR7SKZgNug+2Bj3/iJVhzHAbs78bhM9GoWAXbXZaltsZ5/mbDf/KIE9ARIfcRAWyXTQzez8H4TNSo9tbOWb3JJiBDhP8KcHL5bpoKxt2q2V1zyDFumgah8/wmUXzvIzLlP3NyjCD9xkwe+n8q8SXQOBddPQ7SN5FnxrYvIumQqc2T+QMaXCCjXMyDpv0OKF1UM4nEs4o4RMldzD/lPDzoYP5AIyj2Sk/a8C+VqZcB4eVhe6/X1CONWI4xjHjxNGksw4+1uxQcvbsSDiHxAsZOy2U3s7v6UwIypwn2DXzc1QyGgzpUg72b1c/BzsSTmBc7BI7DxLhS8aQ1QNbrhJYnnExCW7EkDoLfqdd5BzPsGrE7g5eYHnGtq7Zco6d7xbkY/fEISQgb2lVDRLvwFxjd9KR83wfKmLS65gt9z0tzz1WydiIJ8Tul2cjrIaxSUnjLQ4+Q8zQ84fzg4qle7LO558njJn+194mr5Kz6EYuwo5VS84l+MLyDfH/sGajptqCCZawVJun52fiUrV0T2LrzDUYI4v9m6QJqabmP+0IfXOT0I2GAAAAAElFTkSuQmCC";
    let _wbsLookupLink = 'https://confluence.worldline.com/display/SFRP/WBS+Lookup';
    let _autmatixWbsLookupLink = "https://confluence.worldline.com/display/SFRP/Automatix+ESS"
    let _faviconEmpty = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAN9SURBVDhPhVRbTxNBFJ6ZbbeCaIioiKAmBgxovYD6YEAxiBTDJQFsxRA0+uqDJr7rkyb+Ai8PitGYIC03tV4iEYJIRETUeEFQC0FQQWICoaXd7vidlVWoTfzS0z23+c7MzjnLHQ6H4ICUkuHBCKQTyN6dnakmrUprg6mMf/XtevDoacCMESLXGWTRIMTvUGLy2kqkbYdkJSxfVTk3FgVMEGtkFVOPj1OZEMoJeL8aIpTj8YtsRowQuY6ESkUlIxQ49uUjZROT4fOQC4yJjY7CfXsoFklm8gjDA0SSGbZFpd1N+6d+XoRcgu7ninoiGpmJf45MINtVUbIB4QIm9evN3pYfkDHoN+BzOMuLM8y8fzZx8li1NX3D5iRFjV3DuQUi1iALIrJxlxnazORGT6O3jxbsLytar6hxvVj6BuQdePqkrg9JGR7UApODvS97v/GrNZdf4z3ZjRJ/IMP4G8Wia7U33acMz+xuDrgqzqBYFYqtgCgUM8GZ3sNraq7gBnkil9olPazV6VpgaHT403DH8/7gbN68o5l6zrY0K1oqWbHYVgvFelhyyyHO5IiQWqAIaRNwuHQpf9Y13vv0PzLC4+7+kLvxng+bXIC1TkRHtKC/UJkJhr9npKe1ot+qhWKpSl+Xevfd+76xSIK5OoHsSmdZMVdsblgTocBUvrvh9nujbdyepu5waKYEqs2iLnhQUVaS/j+yA7hqpthqYX0nsvombz/F/rSNu76pU9eIlMdZ1Jj7ZaUOvPToZK6KUjv6kchGg/6pPJOMYOzQXFDnaWpnunYOnpWqLdYejYxs/BbBVJkevtDQ7P1sxkiM0TNBDrTEVmjTE2MjT8xY/q6smLyczBjT7nv7qgs5PzDoDrL/FooYvb2522PgzYfR8rCta3r1ygSOd3U0ISnVtyw57TPpKSuW8N63vjBy7uOA2UUFO+Pnbmre6C1ZnpKHLcair285y0vsO3Ly2piwXkS5ceSOk56du6fVWV5ql7rmhc+6cPHSAoMJIJ55XxsuLHTTZOcKa+wzKJkgPz0yNJD1ZfDDVia109hDJsa0C99E46uDNejjv8eO/NoY1dCoVRijFrTDFoze2fbOFzMktTc9Z0OByS0YyRbkHKFccBSaZATzyAZgv8b4+JgePNjQUF/kabwzQH5d1ylm5MD30eOuK0aOC0UH4O8xY1JK9guqLwHJVyxq0wAAAABJRU5ErkJggg==";
    let _faviconFull = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAOSSURBVDhPhVRdbBNHEJ7du3PsYNP8kNIAaZBIAxGIgEARqCmEKqGmhkaNRF6qvlXqY92Xoko8IqG88MpDpYoKBYu6/KRWkYCgqCEISFWaFqmlaX5w5DQ0VogDzuV8vttlZu2jSeSWTxrd7OzOtzOzM8cAEQ6HmZSSM6aWgLr60jqyr8ao2Nw6gCuenb5/6OpgKuftEejscp0jGRGRrADnBVPFmy3dLpTtc8HXEqzd3b18rwSAIytFpxbeLZ5eFbBAcn90jTEHJJKXRSsDttojrI6ORKVZioxw5P2jhwQYu5uqb0JTdT+g3hyJHG2jvdVkHg9XFsRqMlpLLRQ1uAVvVQ6i/AikCy0YLUXmgVIuSfZxV9s2lxlHGpDMp5lKGiqHQKDtow8PNnrnVvuxLz85oG/ftX89lNXUC+6vB6ajsHrJtFa8b0dX4wkI+tLK4bn9OlwZ7QEG7m8g3SGQ4jGTzhQIO8mtVPLe8EianT/31YiLtVEeRWjMUY+wBSPaWZMoWgv4dbYTxjNvg5mvAlfqRWsBGtg/sW/Off03vk3tjnXXZN3aByyIRAEjg1EUevG/gMmB5bwGWbtaTmT2w6On7YyDm+K6Mx/BFOb+mn+HUZ3KjflXkhHoTEDPYJQGG8u0YiXdaWkvhDXT5umdW+sGXBY6nnzW4q8L/QJlerbo9v+YyW6HW1OfgxB6ilkzHbErA6OqbWKXbzzg+fmI5QSfX398QhX/VVBkyc+IbIpZs+2xvjtjZH/ZNhcu9w9rztNjS/mKxRuTX0DODSrHUniWewPJoujHJ5mZejfWNzhe3Co0ttdLvZdu3eHCPJ3Nr4OMtVHZSiEv/FQ7YCJ3Npa4mySbF5gaPQ/KyIw9Bl+CmvKXl4KQmhIPVYGkehDJfYdpTX7EQ7Ji9DpbN/gl0zs2hh7iTY6yU0t89+cZJaQT6IU3hbC3QTtwvL1x7fKgVoxeqLa5DYMO0ksvYJ2olrdTn0LOKX+Uc9b8QTrZqIabQiNIyH1GRUNHkevflL0bcPSO0TdtbpGJsVPwZHHbki7Nk+nJ+3tmJ+7t1YR58slik/k97v2zuFUy/P/gLy1CPl5QK1IGpqmaUNfjnF6DpZnm3m8TPf3D03b/cMq+EE/0cGu6GYT7w+9z7zGMh1407JERvJQVaOg5OOO6u9Adj8c/iPXdniC7EIJGR53pvTo0eTF+qdMQC10c8qMY5c/enpQSXgBz0OfpwrqkcAAAAABJRU5ErkJggg==";
    let _modernEssStartUrl = "https://www.corp.worldline.com/sap/ur?sap-ushell-config=headerless#Timesheet-entry";
    let _modernEssLoginUrl = "https://www.corp.worldline.com/irj/portal?NavigationTarget=navurl%3A%2F%2Fbaff536bcf44bbeff1a64b8649c78372&NavMode=10";

    let _lastEssActivitySignal = null;

    if (scriptAlreadyExecuted()) {
        // some users have it installed twice
        return;
    }

    if (window.location.href.indexOf('/timmi') !== -1 && window.location.href.indexOf('/login') == -1 && window.location.href.indexOf('/timmi-absences') == -1) {
        if (isInIframe()) {
            // timmi has iframes which we don't want to run ess in
            return;
        }

        await appendEss();
        collectTimmiHours();
        await listenForNewSession();
        closeInactiveEss();
        setTimeout(() => { window.location.reload(); }, 1000 * 60 * 15);
    }

    await sessionHandling();

    if (window.location.href.indexOf('ZCA_TIMESHEET') !== -1) {
        fixLayout();
        addFillButtons();
        formatDayTitles();
        hideWeekend();
        await addTimmiHours();
        keepSessionOpen();
        listenForTimmiHours();
        showAddItem();
        enableDotDecimalEntry();
        enableEnterKeySave();
        addTopRightLinks();
        fixWbsOverviewLayout();
        await addFavouritesFeature();
        calculateDiffsOnChange();
        addWeekButtons();
        addEndOfMonthWarning();
        sendActivitySignal();
    }

    if (window.location.href.indexOf('/sap/flp') !== -1 && window.location.href.indexOf('#Timesheet-entry') !== -1) {
        listenForTimmiHoursModernEss();
        keepSessionOpen();
        sendActivitySignal();
        changeShowWeekendDefault();
        addEndOfMonthWarningModernEss();
        addFillButtonsModernEss();
        enableEnterKeySave();
        makeModernEssCompact();
    }

    function makeModernEssCompact() {

        if (!isInIframe()) {
            return;
        }

        $('.jss34')
            .css('margin-left', 'unset')
            .css('max-width', 'unset');

        // $('div').css('min-width', 0);
        // $('footer span').css('word-break', 'break-word');
        // $('span:contains("start by using one of the options.")').closest('div').hide();
        // $('main > div > div > div > .MuiPaper-elevation1').css('width', '28%');
        // $('span:contains("Add activity")').css('width', '80px');
        // $('span:contains("Copy last week")').css('width', '80px');

        // Make sure that WBS name not truncated. Sometimes there are wbs with similar name which only differ at the the end.
        $('main div').css('overflow', 'visible');

        setTimeout(makeModernEssCompact, 500);
    }

    function changeShowWeekendDefault() {

        if (!getCookie('showWeekends')) {
            setCookie('showWeekends', 'false;SameSite=None;Secure');
        }
    }

    function scriptAlreadyExecuted() {

        var duplicateExecutionId = 'timmi-ess-fusion-prevent-duplicate-execution';
        if ($('#' + duplicateExecutionId).length != 0){
            return true;
        }
        $('body').append($('<div id="' + duplicateExecutionId + '" style="display:none"></div>'));
        return false;
    }

    function calculateDiffsOnChange() {

        $('input').change(function(){
            if (isWorkdayInputField($(this))){
                $(this).css('font-weight','bold');
                $(this).css('background-color','white');
                $(this).attr('title','This value is not saved yet');
                var fill = $(this).val() === '*';
                if (fill){
                    $(this).val(0);
                    var cell = $(this);
                    setTimeout(function(){
                        fillCellWithDayDiff(cell);
                        calculateDiffForDay(cell);
                    }, 500);
                }
                calculateDiffForDay($(this));
            }
        });
    }

    function calculateDiffForDay(element) {

        var id = element.attr('id');
        var blurEvent = $('script[for="' + id + '"][event="onblur"]');
        if (blurEvent.length === 1){
            eval(blurEvent.html());
            return;
        }

        var idSuffix = element.attr('id').split('.')[1];
        var totalEssDayHours = 0;
        var sameDayFields = $('input').filter(function(){return isWorkdayInputField($(this)) && $(this).attr('id').endsWith(idSuffix);});
        sameDayFields.each(function(){
            totalEssDayHours += parseFloat($(this).val().replace(',','.')) || 0;
        });
        $('input[id="timesheet_tsdurationdata[2].' + idSuffix + '"]').val(totalEssDayHours.toFixed(2).replace('.',','));
    }

    function fixWbsOverviewLayout() {

        if (!isWbsOverviewDisplayed()){
            return;
        }

        // fix child row sizing
        $('.tier1 > span').click(function(){
            $(this).closest('tr:visible').nextAll().each(function(){
                if ($(this).css('display') === 'block'){
                    $(this).css('display','table-row');
                }
            });
        });

        $('.urTbsDiv').css('height','1%'); // firefox sizing issue
        $('.urTbsDiv').css('background-color','white'); // firefox coloring
        $('td').css('vertical-align','middle');
        $('td, span').css('font-size', '16px');
        $('td:not(:last-child),th:not(:last-child)').css('width', '1%');
        $('td').css('padding', '0 5px');
        $('th').css('padding', '5px');
        $('td,th').css('white-space', 'nowrap');
        $('#super').find('td,th').css('border', '1px solid gray');
        $('.folder').css('display','inline-block'); // unfold/fold button sizing issue

        // remove top row with employee and week info for more clean view
        $('#TSFormWorklist').find('table').first().remove();

        var topBackBtn = $('<a href="#" style="margin-bottom:20px;display:inline-block;padding:5px;">Back</a>');
        setButtonStyle(topBackBtn);
        topBackBtn.prependTo($('body'));
        topBackBtn.click(function(){
            $('#WLBackButton').click();
        });

        // add toggle view link
        var showFilterBtn = $('<buton style="margin-bottom:5px;padding:5px;cursor:pointer;">Toggle Columns</button>');
        setButtonStyle(showFilterBtn);
        $('.app').prepend(showFilterBtn);
        showFilterBtn.click(function(){
            for(var i = 4; i < 15; i++){
                if (i !== 12){
                    $('#super').find('th:nth-child(' + i + ')').toggle();
                    $('#super').find('td:nth-child(' + i + ')').toggle();
                }
            }
        });

        $('span:contains("Filter")').closest('tr').css('background-color', 'lightblue');
        $('span:contains("Filter")').closest('td').css('padding', '5px');
        $('#htmlb_group_1').css('width', '100px');
        $('#LayoutListBox').width($('#s_wbscust').width());
        $('.urTbsWhl').css('margin-bottom','20px');
        $('#super').parent().css('background-color','');

        // fix filter box
        $('.urTbsWhl').css('background-color','rgba(0, 0, 0, 0)');
        $('.urTbsWhl').css('border','none');
        $('.urScrl').css('border','1px solid gray');
        $('.urGrpBdyBox.urScrl').css('border-top','0');
        $('.urGrpTtlBox').removeClass('urGrpTtlBox');
        $('.urTbsCnt').css('padding','0');
        $('.urGrpBdyBoxPd').css('padding','0');
        $('.urGrpBdyBoxPd').find('td').css('border','none');
        $('.urGrpBdyBoxPd').find('table').css('padding','10px');
        $('.urGrpBdyBoxPd').find('input,select').css('width','250px');
        $('#myworklist-cnt-0').css('height','');

        // fix back and select links
        $('.urBtnPaddingEmph')
            .css('margin', '10px')
            .css('padding','5px');
        $('.urBtnPrevPadding')
            .css('padding','5px')
            .text('Back');
        setButtonStyle($('.urBtnPrevPadding'));
        setButtonStyle($('.urBtnPaddingEmph'));
        $('.urBtnStd1PrevStep').removeClass('urBtnStd1PrevStep');
        $('.urBtnEmph1').removeClass('urBtnEmph1');

        // hide useless title
        $('#myworklist-scrl').hide();

        $('#myworklist-cnt-0').css('width','1%');

        // hide empty and unused cells
        $('#super').find('tr').first().remove();
        for(var i = 4; i < 15; i++){
            if (i !== 12){
                $('#super').find('th:nth-child(' + i + ')').hide();
                $('#super').find('td:nth-child(' + i + ')').hide();
            }
        }

        $('th').css('background-color','lightblue');

        // fix paging-buttons
        setButtonStyle($('.urBtnSml'));
        $('.urBtnSml').parent().css('padding','5px');
        $('.urBtnSml').css('height','10px');
        $('.urBtnSml').children().css('font-size','10px');
        $('.urBtnPadding').css('line-height','10px');

        // add paging buttons
        var favPaging = $('.urBtnSml').closest('tr').clone();
        favPaging.attr('id','favPaging');
        var favPagingTbl = $('<table/>');
        favPagingTbl.css('margin-bottom','10px');
        favPagingTbl.append(favPaging);
        $('.urTbsWhl').prepend(favPagingTbl);

        // fix clicking in description field for firefox
        var descField = $('[name=timesheet_search_wbsel]');
        descField.attr('id','s_description');
        descField.attr('onfocus',"sapUrMapi_InputField_focus('s_description',event)");
    }

    async function addFavouritesFeature() {

        $('#worklistIcon').css('vertical-align','middle');

        var favouriteBtn = $('<img style="width:20px;height:20px;vertical-align:middle;cursor:pointer;" src="' + _faviconFull + '"/>')
        favouriteBtn.insertBefore($('#worklistIcon'));
        favouriteBtn.click(function(){
            $('#worklistIcon').click();
        });

        await refreshFavourites();
    }

    async function refreshFavourites() {

        var itemTitleCell = null;
        if ($('#TSFormWorklist').length == 1){
            itemTitleCell = $('.tier1,.tier2').parent().next();
        }
        else{
            itemTitleCell = $('img[title*="Delete"]').closest('tr').find('td[align="left"]:last');
        }
        itemTitleCell.css('white-space', 'nowrap');
        itemTitleCell.css('vertical-align', 'middle');
        $('.favicon').remove();
        $('.favouriteTitle').remove();
        $('.saveFavouriteBtn').remove();
        $('.favouriteInputBox').remove();

        itemTitleCell.each(async function(){
            var favicon = $('<img class="favicon" style="width:20px;height:20px;margin-right:5px;vertical-align:middle"/>');
            favicon.prependTo($(this));
            var itemKey = $(this).prev().find('span').text();
            var wbsTitle = $(this).find('span');
            var savedFavouriteTitle = await getFavourite(itemKey);
            if (savedFavouriteTitle){
                favicon.attr('src', _faviconFull);
                favicon.attr('title', 'Remove from favourites');
                wbsTitle.hide();
                var newTitle = $('<span class="favouriteTitle urTxtStd" style="white-space:nowrap;" title="' + wbsTitle.attr('title') + ' - ' + wbsTitle.text() + '" originalValue="' + wbsTitle.text() + '">' + savedFavouriteTitle + '</span>');
                if (isWbsOverviewDisplayed()){
                    newTitle.css('font-size', '16px');
                }
                $(this).append(newTitle);
                newTitle.prev('br').remove();
            }
            else {
                wbsTitle.show();
                favicon.attr('src', _faviconEmpty);
                favicon.attr('title', 'Add to favourites');
            }

            favicon.css('cursor', 'pointer');
            favicon.click(async function(){
                if ($(this).attr('src') == _faviconFull){
                    deleteFavourite($(this).parent().prev().find('span').text());
                    await refreshFavourites();
                }
                else {
                    $(this).attr('src', _faviconFull);
                    var wbsTitle = $(this).next();
                    wbsTitle.hide();
                    var inputBox = $('<input type="text" class="urTxtStd favouriteInputBox" value="' + wbsTitle.text() + '" originalValue="' + wbsTitle.text() + '" title="' + wbsTitle.attr('title') + '" />');
                    $(this).parent().append(inputBox);
                    inputBox.blur(function(e) {
                        e.preventDefault();
                        $(this).next().click();
                    });
                    inputBox.keydown(function(e){
                        if(e.keyCode == 13){
                            e.preventDefault();
                            $(this).next().click();
                        }});
                    var existingSaveBtn = $('img[title*="Save"]');
                    var newSaveBtn = $('<a class="saveFavouriteBtn" style="margin-left:5px;font-size:10px;" href="#">Save</a>');
                    newSaveBtn.insertAfter(inputBox);
                    inputBox.select();
                    newSaveBtn.click(async function(){
                        saveFavourite($(this).parent().prev().find('span').text(), $(this).prev().val());
                        await refreshFavourites();
                    });
                }
            });
        });

        await addFavouritesOverview();
    }

    async function addFavouritesOverview(){

        $('#favouritesTable').remove();
        var favouritesTable = $('<table id="favouritesTable" style="border:1px solid gray;padding:10px;border-collapse: collapse;" cellspacing="0"></table>"');
        favouritesTable.append($('<tr><td colspan="4" style="padding:5px;background-color:lightblue;vertical-align:middle;"><img style="width:15px;height:15px;vertical-align:middle;" src="' + _faviconFull + '"/> <span>Favourites</span></td></tr>'));
        $('.urTbsDiv').empty();
        $('.urTbsDiv').append(favouritesTable);
        favouritesTable.hide();
        $('.urTbsDiv').css('margin-bottom','20px');

        var favFounds = {};
        $('.urVt1').each(async function() {
            var txt = $(this).text();
            var savedFavouriteTitle = await getFavourite(txt);
            if (savedFavouriteTitle && ! favFounds.hasOwnProperty(txt)) {
                favFounds[txt] = true;
                favouritesTable.show();
                var favRow = $('<tr></tr>');
                favRow.append($('<td style="vertical-align:middle"><a href="#" class="addFromFavouritesBtn" wbsKey="' + $(this).text() + '">Select</a></td>'));
                var favicon = $('<img style="width:20px;height:20px;cursor:pointer;vertical-align:middle;" title="Delete item from favourites" wbsKey="' + $(this).text() + '" src="' + _faviconFull + '"/>');
                favicon.click(async function(){
                    deleteFavourite($(this).attr('wbsKey'));
                    await refreshFavourites();
                });
                var titleCell = $('<td style="width:99%;vertical-align:middle;"> ' + savedFavouriteTitle + '</td>');
                titleCell.prepend(favicon);
                favRow.append(titleCell);
                favRow.append($('<td>' + $(this).closest('td').next().find('.urVt1').text() + '</td>'));
                favRow.append($('<td>' + $(this).text() + '</td>'));
                favouritesTable.append(favRow);

                favRow.children('td').css('border', '1px solid gray');
                favRow.children('td').css('padding', '1px 10px');
                favRow.children('td').css('white-space', 'nowrap');

                favRow.find('.addFromFavouritesBtn').click(function(){
                    var wbsKey = $(this).attr('wbsKey');
                    $('input[type="checkbox"]').each(function(){
                        var isSelectedFavourite = false;
                        $(this).parent().find('span').each(function(){
                            if ($(this).text() === wbsKey){
                                isSelectedFavourite = true;
                            }
                        });
                        $(this).prop("checked", isSelectedFavourite);

                    });
                    $('#WLSelectButton').click();
                });
            }

            setButtonStyle($('.addFromFavouritesBtn'));
            $('.addFromFavouritesBtn').css('padding','1px 5px');
        });
    }

    function deleteFavourite(key) {

        GM.setValue('ess_favourite_' + key, '');
    }

    function saveFavourite(key, newTitle) {

        GM.setValue('ess_favourite_' + key, newTitle);
    }

    async function getFavourite(key) {

        return await GM.getValue('ess_favourite_' + key);
    }

    function isWorkdayInputField(element) {

        if (!element.attr('id')){
            return false;
        }
        if (element.attr('readonly')){
            return false;
        }

        return element.attr('id').indexOf('.mondhours') !== -1
        || element.attr('id').indexOf('.tueshours') !== -1
        || element.attr('id').indexOf('.wedhours') !== -1
        || element.attr('id').indexOf('.thurhours') !== -1
        || element.attr('id').indexOf('.fridhours') !== -1
        || element.attr('id').indexOf('.sathours') !== -1
        || element.attr('id').indexOf('.sunhours') !== -1;
    }

    async function listenForNewSession(){

        GM_addValueChangeListener('ess_sessionUrl', async function(name, old_value, newSession, remote) {
            if (newSession) {
                if (old_value) {
                    // just reload after login. avoid endless reloads.
                    return;
                }
                var essIframe = $('#essIframe');
                essIframe.attr('src', (await getStartUrl()).replace('?', '?reload&'));
                window.focus();

                if (_loginWindow) {
                    _loginWindow.close();
                }
            }
        });
    }

    async function sessionHandling() {

        if (window.location.href.indexOf('ZCA_TIMESHEET') !== -1 || window.location.href.indexOf('/sap/') !== -1) {
            $('body').append($('<div><img src="https://qa.saferpay.com/userscripts/timmi-ess-fusion-saferpay-logo.png?cachebusting=' + moment(new Date()).format("YYYY-MM-DD") + '"/></div>').hide());

            if (areCookiesBlocked()) {
                showAllowCookiesMessage();

                window.parent.postMessage({
                    cookiesNeedtoBeActivated : true
                }, '*');
            }
            if (isSessionTimedOut()) {
                $('body').empty()

                window.parent.postMessage({
                    loginRequired : true
                }, '*');
            }
            else if (isTimeEntryDisplayed()) {

                GM.setValue('ess_sessionUrl', window.location.href);

                if (isLegacyTimeEntryDisplayed()) {
                    GM.setValue('legacyEss_sessionUrl', window.location.href);
                }

                // have to set additional properties on cookie so chrmoe does not block it in iframe

                var sessionCookie = getCookie('SAP_SESSIONID_P01_360');
                if (sessionCookie){
                    setCookie('SAP_SESSIONID_P01_360', sessionCookie+ ';SameSite=None;Secure');
                }

                var sessionCookie2 = getCookie('SAP_SESSIONID_FP1_360');
                if (sessionCookie2){
                    setCookie('SAP_SESSIONID_FP1_360', sessionCookie2+ ';SameSite=None;Secure');
                }

                setCookie('CookiesAllowedTest_Lax','true;SameSite=Lax;Secure');
                setCookie('CookiesAllowedTest_None','true;SameSite=None;Secure');
            }
        }
    }

    function areCookiesBlocked() {

        setCookie('CookiesAllowedTest_Any','true;SameSite=None;Secure');
        if (!document.cookie) {
            // browser blocks ALL third party cookies
            return true;
        }

        if (getCookie('CookiesAllowedTest_None') != 'true') {
            // user did not login yet
            return false;
        }

        return areThirdPartyCookiesBlocked();
    }

    function areThirdPartyCookiesBlocked() {

        if (document.cookie.indexOf('SAP_SESSIONID') == -1) {
            return true;
        }

        return false;
    }

    function showAllowCookiesMessage() {

        var body = $('body');
        body.empty();
        body.css('padding','20px');
        body.append($('<div style="padding-bottom:20px;">Your browser is blocking ESS Cookies. Please allow them:</div>'));
        var isFirefox = typeof InstallTrigger !== 'undefined';
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google/.test(navigator.vendor);
        if (isFirefox) {
            body.append($('<img src="https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/images/timmi-ess-fusion-allow-cookies-firefox.png"/>'));
        }
        else if (isChrome) {
            body.append($('<img src="https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/images/timmi-ess-fusion-allow-cookies-chrome.png"/>'));
        }
    }

    let _loginWindow = null;

    function openPopup(url, title, w, h) {

        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

        const width = screen.width;
        const height = screen.height;

        const systemZoom = 1;
        const left = (width - w - 50) / systemZoom + dualScreenLeft
        const top = (height - h - 150) / systemZoom + dualScreenTop
        const newWindow = window.open(url, title,`scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`);

        if (window.focus) newWindow.focus();

        _loginWindow = newWindow;
    }

    function isWbsOverviewDisplayed() {

        return $('#WLSelectButton').length == 1;
    }

    function isTimeEntryDisplayed() {

        return isLegacyTimeEntryDisplayed() || isModernTimeEntryDisplayed();
    }

    function isModernTimeEntryDisplayed() {

        return $('#sap-ui-static').length != 0;
    }

    function isLegacyTimeEntryDisplayed() {

        return $('input[id="timesheet_tsdurationdata[2].mondhours"]').length != 0;
    }

    async function getStartUrl() {

        var sessionUrl = await GM.getValue('ess_sessionUrl');

        var startUrl = sessionUrl || _modernEssStartUrl;

        if (startUrl.indexOf('ZCA_TIMESHEET') == -1) {
            // need to redirect because other Url does not work when refreshing page
            startUrl = _modernEssStartUrl;
        }

        return startUrl;
    }

    async function appendEss() {

        if ($('.pageLayout-container-main-content').length == 0) {
            setTimeout(appendEss, 1000);
            return;
        }

        var essIframe = $('<iframe id="essIframe" maximized="false" src="' + await getStartUrl() + '"/>');
        essIframe.hide();
        $('.pageLayout-container-main-content').append(essIframe);
        minimizeEssFrame();

        appendHelpBox();

        var loginBtn = $('<button id="loginBtn">ESS</button>');
        $('body').append(loginBtn);
        setButtonStyle(loginBtn);
        loginBtn
            .css('position','fixed')
            .css('bottom','15px')
            .css('right','340px')
            .css('width','80px')
            .css('height','20px')
            .css('z-index','100')
            .css('padding','0');

        var oldLoginBtn = $('<button id="oldLoginBtn">old ESS</button>');
        $('body').append(oldLoginBtn);
        setButtonStyle(oldLoginBtn);
        oldLoginBtn
            .css('position','fixed')
            .css('bottom','15px')
            .css('right','440px')
            .css('width','80px')
            .css('height','20px')
            .css('z-index','100')
            .css('padding','0')
            .css('background-color', 'lightgray')
            .css('color', 'black');

        oldLoginBtn.click(async function(e) {
            if ($(this).text() == 'old ESS') {
                GM.setValue('ess_sessionUrl','');
                openPopup(_essLoginUrl + '&closeAfterLogin','ESS Login', 400, 750);
                $(this).text('new ESS');
            }
            else {
                GM.setValue('ess_sessionUrl','');
                openPopup(_modernEssLoginUrl + '&closeAfterLogin','ESS Login', 400, 750);
                $(this).text('old ESS');
            }
        });

        loginBtn.click(async function(e) {
            if (!isEssActive()) {
                GM.setValue('ess_sessionUrl','');
                openPopup(_modernEssLoginUrl + '&closeAfterLogin','ESS Login', 400, 750);
            }
        });

        $(window).on('message', function (e) {
            if (e.originalEvent.data.loginRequired) {
                essIframe.hide();
            }
            if (e.originalEvent.data.essIsActive) {
                essIframe.show();
                _lastEssActivitySignal = new Date();
            }
            if (e.originalEvent.data.cookiesNeedtoBeActivated) {
                essIframe.show();
            }
        });
    }

    function appendHelpBox() {

        var helpBtn = $('<a href="javascript:void()">Help</a>');
        helpBtn.click(function() {
            $('#helpBox').toggle();
        });
        $('body').append(helpBtn);
        helpBtn
            .css('position','fixed')
            .css('width','70px')
            .css('bottom','14px')
            .css('line-height','10px')
            .css('right','540px')
            .css('z-index','100')
            .css('font-family','arial')
            .css('font-size','14px')
            .css('background-color', 'white')
            .css('padding', '5px')
            .css('border', '1px solid lightgray')
            .css('border-radius', '5px')
            .css('text-decoration', 'none')
            .css('text-align', 'center');

        var emailHiddenFromWebCrawler = 'c2lwOmRyYWdhbi5pZ25qaWNAd29ybGRsaW5lLmNvbQ==';

        var helpBox = $(`<div id="helpBox">
        <b>Login Problems</b><a id="closeHelpBtn" href="javascript:void();" style="float:right;text-decoration:none;">close</a><br>
        If you cannot login try following:
        <ul>
            <li>Restart your Browser.</li>
            <li>Activate third party cookies in your
            <a href="https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/images/timmi-ess-fusion-allow-cookies-chrome.png" target="_blank">Chrome</a> or
            <a href="https://raw.githubusercontent.com/draganignjic/timmi-ess-fusion/master/images/timmi-ess-fusion-allow-cookies-firefox.png" target="_blank">Firefox</a> setting.</li>
            <li>Login into the <a href="https://www.corp.worldline.com" target="_blank">worldline portal</a> in another browser tab and then return here.</li>
            <li>Update the Timmi ESS Script <a href="` + _updateUrl + `" target="_blank">here</a></li>
            <li>Contact the Support in <a href="` + atob(emailHiddenFromWebCrawler) + `">MS Teams</a></li>
        </ul>
        <br>

        </div>`);
        $('body').append(helpBox);
        helpBox
            .css('background-color', 'white')
            .css('border', '1px solid lightgray')
            .css('border-radius', '10px')
            .css('position', 'fixed')
            .css('bottom', '50px')
            .css('right', '220px')
            .css('width', '550px')
            .css('height', '200px')
            .css('z-index', 1000)
            .css('font-family', 'arial')
            .css('font-size', '14px')
            .css('padding', '10px');
        helpBox.hide();

        $('#closeHelpBtn').click(function() {
            helpBox.hide();
        });

        setTimeout(function() {
            if ($('#lucca-banner-avatar').css('background-image').indexOf('employees/929/picture') != -1) {
                var cheesyMessage = "RHJhZ2FuIGFuZCBMdW5hIGxvdmUgeW91";
                $('body').append('<div style="position:fixed;top:10px;left:50%;z-index:10000;font-family:arial;color:gray;">' + atob(cheesyMessage) + ' <span style="color:red;font-size:20px;font-style: normal">&#10084;</span></div>');
            }
        }, 1000);
    }

    function isEssActive() {
        return (_lastEssActivitySignal && (new Date() - _lastEssActivitySignal)/ 1000 < 1);
    }

    function closeInactiveEss() {

        if (_lastEssActivitySignal && (new Date() - _lastEssActivitySignal)/ 1000 >= 10) {
            $('#essIframe').hide();
            $('#loginBtn').text('ESS');
        }

        setTimeout(closeInactiveEss, 1000);
    }

    function setButtonStyle(btn) {

        btn
            .css('display','inline-block')
            .css('text-decoration','none')
            .css('background-color','#66A3C7')
            .css('border','1px solid gray')
            .css('color','white')
            .css('font-size','10px')
            .css('font-family','arial')
            .css('white-space','nowrap')
            .css('padding','5px')
            .css('border-radius','2px')
            .css('veritcal-align','middle')
            .css('text-align','center')
            .css('border-radius','5px')
            .css('cursor','pointer');
    }

    function minimizeEssFrame() {

        var essIframe = $('#essIframe');
        essIframe
            .attr('maximized','false')
            .css('z-index','100')
            .css('border','1px solid lightgray')
            .css('border-radius','10px')
            .css('width','100%')
            .css('height','600px');

        $('#oldNewEssBtn').show();
    }

    function maximizeEssFrame() {

        var essIframe = $('#essIframe');
        essIframe
            .attr('maximized','true')
            .css('top', '50px')
            .css('left', '50px')
            .css('width', 'calc(100% - 55px)')
            .css('height', 'calc(100% - 55px)')
            .css('border', '1px solid gray');
    }

    function collectTimmiHours() {

        setTimeout(collectTimmiHours, 500);

        var dateText = $('tt-timesheet-picker span').eq(0).text()?.trim();
        if (!dateText) {
            return;
        }

        var month = moment(dateText, 'MMMM', $('html').attr('lang'));

        $('tt-date-display').each(function() {
            var dayNumber = $(this).find('span').eq(0).text().replace(/\D/g, '');
            var day = month.set("date", dayNumber)
            let totalHours = 0;

            var hoursAndMinutes = $(this).parent().find('.timeProgress-time-text').find('span').eq(0).text();
            if (hoursAndMinutes) {
                const hoursAndMinutesRegex = new RegExp("([0-9]{1,2})[A-Za-z\. ]*?([0-9]{2})");
                let matchGroups = hoursAndMinutes.match(hoursAndMinutesRegex);
                var hours = parseInt(matchGroups[1]);
                var minutes = matchGroups[2];
                totalHours = hours + minutes / 60;
            }

            var essIframe = document.getElementById('essIframe');
            if (essIframe) {
                essIframe.contentWindow.postMessage({
                    day: day.format('YYYY-MM-DD'),
                    totalHours: totalHours
                }, '*');
            }
        });
    }

    function getTimmiHoursForDay(dayRowElement, day) {

        var totalHours = 0;
        dayRowElement.find('.period').each(function() {
            var inputs = $(this).find('input');
            if (inputs.length === 4){
                var startH = inputs.eq(0).val();
                var startM = inputs.eq(1).val();
                var endH = inputs.eq(2).val();
                var endM = inputs.eq(3).val();

                var start = moment(day.format('YYYY-MM-DD') + ' ' + startH + ':' + startM);
                var end = moment(day.format('YYYY-MM-DD') + ' ' + endH + ':' + endM);

                if (endH == 0 && endM == 0){
                    end = end.add(1, 'days');
                }

                var duration = moment.duration(end.diff(start));
                totalHours += duration.asHours();
            }
        });

        return totalHours;
    }

    function addTopRightLinks() {

        var row = $('#employee_kostl_l').closest('tr');
        row.css('white-space', 'nowrap');

        var link = $('<td><a style="font-family:arial;font-size:12px;" href="' + self.location.href.replace('&closeAfterLogin','') + '" target="_top">Fullscreen</a></td>');
        row.append(link);

        var isSaferpayUser = row.find('span:contains("CH08804041")').length === 1;
        if (isSaferpayUser){
            // Add a confluence link at the top right for the wbs lookup
            var wbsLink = $('<td style="text-align:right;width:100%;font-size:12px;padding-right:10px;"><a href="' + _wbsLookupLink + '" target="_blank">Saferpay WBS Lookup</a> - <a href="' + _autmatixWbsLookupLink + '" target="_blank">Automatix</a></td>');
            row.append(wbsLink);
        }
        else if (row.find('span:contains("10270394")').length === 1) {
            var cheesyMessage = "RHJhZ2FuIExvdmVzIFlvdQ==";
            row.append('<td style="text-align:right;width:100%;font-size:15px;padding-right:10px;line-height:5px;font-style: italic;">' + atob(cheesyMessage) + ' <span style="color:red;font-size:20px;font-style: normal">&#10084;</span></td>');
        }
        else {
            var feedbackHelpLink = $('<td style="text-align:right;width:100%;font-size:12px;padding-right:10px;"><a hreF="mailto:timmi-ess-fusion@dragan.ch?subject=Timmi ESS Fusion - Feedback / Help">Feedback / Help</a></td>');
            row.append(feedbackHelpLink);
        }
    }

    function isSessionTimedOut(){

        return ($('form[name="loginForm"]').length > 0
                || $('*:contains("Session not found")').length > 0
                || $('*:contains("Session does not exist")').length > 0
                || $('*:contains("Session timed out")').length > 0
                || $('*:contains("session is expired")').length > 0
                || $('*:contains("This logon is obsolete and deprecated")').length > 0
                || $('*:contains("Choose one of the available Identity Providers")').length > 0
                || $('*:contains("Service Not Available")').length > 0
                || $('*:contains("You logged of")').length > 0);
    }

    function enableEnterKeySave(){
        $(document).on("keypress", "input", function(e){
            if(e.which == 13){
                if ($(this).attr('id') === 'timesheet_pperiod') {
                    $('#changePeriodButton').click();
                }
                else if (isWorkhourInputField($(this))){
                    if ($(this).val() === '*'){
                        var fillBtn = $(this).parent().find('.fillDayBtn');
                        setTimeout(function(){
                            fillBtn.click();
                        }, 500);
                    }
                    else {
                        $('#save').focus();
                        $('#save').click();
                    }
                }
                else if (isCommentField($(this))){
                    $('#save').focus();
                    $('#save').click();
                }
            }
        });
    }

    function isCommentField(element){

        var id = element.attr('id');
        return id && id.startsWith('timesheet_tsdurationdata') && id.endsWith('shorttext');
    }

    function enableDotDecimalEntry(){

        $(document).on('change', 'input', function() {
            if (isWorkhourInputField($(this))){
                $(this).val($(this).val().replace('.', ','));
            }
        });
    }

    function isWorkhourInputField(element){

        var id = element.attr('id');
        if (id && id.startsWith("timesheet_tsdurationdata") && id.endsWith("hours")) {
            return true;
        }

        return elemnet.hasClass('MuiInputBase-input');

    }

    function fixLayout(){

        $('head').append('<link _id="urstyle" rel="stylesheet" type="text/css" href="/sap/public/bc/bsp/Design2008/themes/sap_tradeshow/ur/ur_sf3.css?7.33.3.72.0">');

        //fix overall size
        $('table[cellspacing=10]').attr('cellspacing','2');
        $('#refreshIcon').closest('table').parents().closest('table').css('height','1%');
        $('#refreshIcon').parents('tr').css('height','1%');
        $('#refreshIcon').css('margin-left','7px');
        $('body > table').css('height','100%');

        $('#htmlb_image_2').hide();

        // vertical alignment
        $('.urTxtStd').parent().removeAttr('valign');
        $('#htmlb_image_1').closest('tr').find('td').css('line-height','20px');
        $('#htmlb_image_1').closest('tr').find('td').css('padding-right','20px');

        // week start end box
        $('input[id="myinputfield"]').parent().css('background-color','lightblue');
        $('input[id="myinputfield"]').css('width','70px');
        $('input[id="myinputfield"]').css('text-align','center');

        // current week box
        $('input[name="timesheet_pperiod"]')
            .css('height', '24px')
            .css('width', '55px')
            .css('text-align', 'center')
            .css('border-radius', '5px');

        // remove "Hours" text
        $('span:contains("Hours")').filter(function(){ return $(this).text() == "Hours"}).text('');

        // fix week total width
        var timeCells = $('input[id*="hours"],input[id*=".weektotal"]')
        timeCells
            .css('padding', '5px')
            .css('font-size', '12px')
            .css('width', '47px')
            .css('text-align', 'right');

        // fix useless title row
        $('.urGrpBdyWeb1').parent().remove();

        // fix horizontal scrollbar
        $('#dateRow').css({position: 'relative', top: '0'});
        // remove mouseMove listener which resets dateRow position
        $('#sapDate').remove();
        document.body.onscroll = function() { $('#dateRow').css({top: '0'}); };
        document.onmousemove = function() { $('#dateRow').css({top: '0'}); };

        // add saferpay Logo
        $('#htmlb_image_1')
            .attr('src', _saferpayLogo)
            .css('margin-right','10px')
            .wrap('<a href="https://www.saferpay.com" target="_blank"></a>');

        $('.urGrpTtlBox')
            .css('padding','5px')
            .css('border-radius','5px')
            .css('background-color', 'lightblue'); // #5FC7A9

        // border for legend;
        $('img[id^="htmlb_image_"]')
            .css('border-radius','5px');

        // hide empty rows
        $('td:contains("      ")').filter(function() {
            var text = $(this).text().replace(/\s*/g, '');
            return !text && $(this).children().length == 0 && $(this).parent().children().length == 1;
        }).parent().hide();

        // fix size/position of row with day titles
        var topRow = $('td[width="50%"]').parent();
        var lowRow = $('span:contains("Target times")').parent().parent();
        for(var i = 0; i < 9; i++){
            var topCol = topRow.children().eq(i);
            var lowCol = lowRow.children().eq(i);
            topCol.width(lowCol.width());
        }

        // title row background color
        $('#dateRow').css('background-color','transparent');

        // make wbs title column max and all other columns min width
        $('img[title*="Delete"]').closest('tr').find('td').css('width', '1%');
        $('img[title*="Delete"]').closest('tr').find('td[align="left"]:last').css('width', '100%');

        // align elements because some wbs are shifted one cell to the left
        $('img[title*="Delete"]').closest('td').next().each(function() {
            if ($(this).text().trim() != '') {
                $(this).next().children().prependTo($(this).next().next());
                $(this).children().prependTo($(this).next());
                $(this).next().children().slice(1).hide();
                $(this).next().next().children('br').eq(0).replaceWith('<span> - </span>');
            }
        });


        // add missing coloring of input cells (saved, released, approved, rejected) which are just displayed in IE
        $('script[for][event="onload"]').each(function(){
            if ($(this).html().indexOf('00ff00')){
                eval($(this).html());
            }
        });

        // usability improvement: clear cell if user clicks on it an it has zero hours
        $('input[value="0,00"]').filter(function(){return $(this).attr('id').indexOf('timesheet_tsdurationdata[2].') == -1;}).css('color','lightgray');
        $('input').focus(function(){
            if ($(this).val() == '0,00'){
                $(this).val('');
                $(this).css('color','black');
            }
        });
        $('input').blur(function(){
            if (isWorkdayInputField($(this)) && $(this).val() == ''){
                $(this).val('0,00');
                $(this).css('color','lightgray');
                $(this).css('font-weight','normal');
            }
        });

        // input field color
        $('input').css('border','1px solid lightgray');

        // icon positioning
        $('td[valign="BOTTOM"]').attr('valign','');

        // fix td vertical aligning
        $('input[id*="hours"]').parent().css('vertical-align','middle');
        $('img').css('vertical-align','middle');
        $('img').parent().css('vertical-align','middle');

        // align week-change-arrow to right border
        $('#gotoPrevPeriodIcon').parent().css('text-align','right');
        $('#gotoNextPeriodIcon').parent().css('padding-right', '10px');
        $('#gotoNextPeriodIcon').css('margin-left','5px');
        $('#gotoPrevPeriodIcon').css('vertical-align','');
        $('#gotoPrevPeriodIcon').attr('align','');
        $('#gotoNextPeriodIcon').css('vertical-align','');
        $('#gotoNextPeriodIcon').attr('align','');

        // week total title
        var weekTotalTitle = $('span:contains("Week total"),span:contains("Summe Woche")');
        var weekTotalCell = weekTotalTitle.parent();
        weekTotalTitle.remove('');
        weekTotalCell.parent().css('vertical-align','bottom');
        var toggleWeekendBtn = $('<a style="font-family:arial;font-size:12px;" href="javascript:void(0);">Weekend</a>');
        weekTotalCell.append(toggleWeekendBtn);
        toggleWeekendBtn.click(function(){
            toggleWeekend();
        });

        // fix etc button click
        var etcBtn = $('#etc-button');
        etcBtn.attr('onclick', etcBtn.attr('ocl'));

        // consistent button style
        setButtonStyle($('#etc-button'));
        setButtonStyle($('#eticketopen'));
        setButtonStyle($('#changePeriodButton'));

        // hour input fields should align left because fill buttons are on the right
        $('input[id^=timesheet_tsdurationdata]').parent().parent().removeAttr('align');

        $('#message:contains("Unsaved hours exist in current week.  Please save or refresh your timesheet.")').append($('#refreshIcon').clone().attr('id',''));
    }

    function addWeekButtons() {

        if ($('#timesheet_pperiod').length === 1){
            var container = $('input[id="myinputfield"]').closest('td');
            container.children().hide();
            var currentWeekNumber = parseInt($('#timesheet_pperiod').val().split('.')[0]);
            for (var j = Math.max(1, currentWeekNumber - 5); j <= currentWeekNumber + 1;j++){
                var weekBtn = $('<button type="button" style="margin-right:10px;background-color:#66A3C7;border:1px solid gray;color:white;">Week ' + j + '</button>');
                setButtonStyle(weekBtn);
                if (currentWeekNumber == j){
                    weekBtn.css('background-color','white');
                    weekBtn.css('color','black');
                }
                var isoWeek = moment().isoWeek(j);
                if (moment().isoWeek() == j){
                    weekBtn.text('current');
                }
                weekBtn.attr('title', isoWeek.startOf('isoWeek').format('DD.MM.YYYY') + ' - ' + isoWeek.endOf('isoWeek').format('DD.MM.YYYY'));
                weekBtn.attr('weekNum', ('0' + j).substr(-2) + '.' + (new Date).getFullYear());
                weekBtn.click(function(){
                    $('#timesheet_pperiod').val($(this).attr('weekNum'));
                    $('#changePeriodButton').click();
                });
                container.append(weekBtn);
            }
        }
    }

    function showAddItem(){

        if ($('input[id="timesheet_tsdurationdata[3].mondhours"]').length === 1){
            return;
        }

        var totalsEssRow = $('span:contains("Total per day ESS")').closest('tr');
        var newRow = $('<tr>');
        newRow.insertBefore(totalsEssRow);
        var newCell = $('<td colspan="5" style="width:100%"></td>');
        newRow.append(newCell);

        newCell.css('font-size', totalsEssRow.find('span').css('font-size'));

        var newAddBtn = $('#worklistIcon').clone();
        newAddBtn.attr('id','');
        var addText = $('<p><a href="#">Add new item</a></p>');
        newAddBtn.prependTo(addText);
        newCell.append(addText);
        addText.click(function() {
            $('#worklistIcon').click();
        });

        var newCopyBtn  = $('#copyPrevPeriod').clone();
        newCopyBtn.attr('id','');
        var copyText = $('<p><a href="#">Copy from last week</a></p>');
        newCopyBtn.prependTo(copyText);

        copyText.click(function(){
            $('#copyPrevPeriod').click();
        });
        newCell.append(copyText);

        newCell.find('img').css('margin-right', '10px');
    }

    function listenForTimmiHours() {

        $(window).on('message', function (e) {
            var timmiRow = $('#timmi_row');
            var diffRow = $('#diff_row');
            var essRow = $('#ess_row');

            var firstDayOfWeek = moment($('.urEdf2TxtEnbl.urEdf2TxtRo').val(), 'DD.MM.YYYY');

            timmiRow.find('input[id*="hours"]').each(async function(dayOfWeek) {

                var currentDay = firstDayOfWeek.clone().add(dayOfWeek, 'days')

                if (currentDay.format('YYYY-MM-DD') == e.originalEvent.data.day) {

                    var diffCell = diffRow.find('input').eq(dayOfWeek);
                    $(this).val('');
                    diffCell.val('');
                    diffCell.css('background-color', '');
                    var dayName = diffCell.attr('id').split('.').pop().replace('_diff','');
                    var fillButtons = $('span[id*="' + dayName + '"] > .fillDayBtn');
                    fillButtons.hide();

                    var timmiHours = parseFloat(e.originalEvent.data.totalHours);

                    var decimalPlaces = 2;
                    $(this).val(timmiHours.toFixed(decimalPlaces).replace('.',','));

                    var essHoursRaw = essRow.find('input').eq(dayOfWeek).val();
                    var essHours = parseFloat(essHoursRaw.replace(',','.'));

                    if (!timmiHours) {
                        return;
                    }

                    var diff = essHours - timmiHours;

                    if (parseFloat(Math.abs(diff.toFixed(2))) !== 0){
                        diffCell.val(diff.toFixed(2).replace('.',','));
                        diffCell
                            .css('background-color', 'lightcoral')
                            .css('color','white');

                        if (diff < 0){
                            diffCell.attr('title', 'You have ' + Math.abs(diff).toFixed(2) + ' hours more in Timmi compared to ESS');
                        }
                        else {
                            diffCell.attr('title', 'You have ' + diff.toFixed(2) + ' hours more in ESS compared to Timmi');
                        }
                        fillButtons.each(function(){
                            var hourInCell = parseFloat($(this).prev().val());
                            if (hourInCell > 0 || diff < 0) {
                                $(this).show();
                            }
                        });
                    }
                }
            });
        });
    }

    function getFirstDayOfWeek() {

        if ($('#mainContainer').length == 0) {
            return;
        }
        var firstDay = $('#mainContainer').text().replace('Mo ','');
        firstDay += '/' + new Date().getFullYear();
        return moment(firstDay , 'DD/MM/YYYY');
    }

    function listenForTimmiHoursModernEss() {

        $(window).on('message', function (e) {

            var firstDayOfWeek = getFirstDayOfWeek();
            if (!firstDayOfWeek) {
                return;
            }

            $('footer span:contains("/")').each(async function(dayOfWeek) {

                var currentDay = firstDayOfWeek.clone().add(dayOfWeek, 'days');

                if (currentDay.format('YYYY-MM-DD') == e.originalEvent.data.day) {

                    var fillButtons = $('.fillDayBtn[day="' + currentDay.format('YYYY-MM-DD') + '"]');
                    fillButtons.hide();

                    var diffCell = $(this);
                    diffCell.val('')
                        .css('background-color', '')
                        .css('color', '#6D6D6D')
                        .css('padding', '4px')
                        .css('border-radius', '0 4px 4px 0');

                    diffCell.prev()
                        .css('background-color', '')
                        .css('color', '#6D6D6D')
                        .css('padding', '4px')
                        .css('border-radius', '4px 0 0 4px');

                    var timmiHours = parseFloat(e.originalEvent.data.totalHours);
                    if (!timmiHours) {
                        return;
                    }

                    var decimalPlaces = 2;

                    var newValueForDiffCell = timmiHours.toFixed(decimalPlaces).replace('.',',');
                    var essHoursRaw = diffCell.prev().text();
                    if (essHoursRaw.indexOf(':') !== -1) {
                        essHoursRaw = moment.duration(essHoursRaw).asHours();
                        newValueForDiffCell = convertDecimalHoursToHoursAndMinutes(newValueForDiffCell);
                    }
                    else {
                        essHoursRaw = essHoursRaw.replace(',','.')
                    }
                    var essHours = parseFloat(essHoursRaw);

                    diffCell.html(' /&nbsp;' + newValueForDiffCell);

                    var diff = essHours - timmiHours;

                    if (parseFloat(Math.abs(diff.toFixed(decimalPlaces))) > Number.EPSILON) {
                        diffCell
                            .css('background-color', 'lightcoral')
                            .css('color','white');
                        diffCell.prev()
                            .css('background-color', 'lightcoral')
                            .css('color','white');

                        diffCell.attr('dayTotalDiffCellDate', currentDay.format('YYYY-MM-DD'));
                        diffCell.attr('dayTotalDiffCellDiffValue', diff.toFixed(decimalPlaces));
                        diffCell.attr('dayTotalDiffCellEssHours', essHours);

                        if (diff < 0){
                            diffCell.attr('title', 'You have ' + Math.abs(diff).toFixed(decimalPlaces) + ' hours more in Timmi compared to ESS');
                        }
                        else {
                            diffCell.attr('title', 'You have ' + diff.toFixed(decimalPlaces) + ' hours more in ESS compared to Timmi');
                        }
                        fillButtons.each(function(){
                            var hourInCell = parseFloat(diff);
                            if (hourInCell > 0 || diff < 0) {
                                $(this).show();
                            }
                        });
                    }
                    else {
                        diffCell
                            .css('background-color', '#c7ebe8')
                            .css('color','#00A59C');
                        diffCell.prev()
                            .css('background-color', '#c7ebe8')
                            .css('color','#00A59C');
                    }
                }
            });
        });
    }

    function convertDecimalHoursToHoursAndMinutes(hoursWithDecimals) {

        var parts = hoursWithDecimals.replace('.',',').split(',');
        var hours = parts[0];
        var decimalHours = parts[1] || 0;
        var minutes = Math.round(decimalHours * 0.6);
        if (minutes < 10) {
            minutes += '0';
        }
        return hours + ':' + minutes;
    }

    function addEndOfMonthWarning() {

        var secondLastWorkday = getSecondLastWorkdayOfMonth();
        $('span[weekTitle]').each(function(){
            if ($(this).text().indexOf(secondLastWorkday.format('DD.MM.YYYY')) != -1) {
                $(this).css('background-color','lightyellow');
                $(this).css('border-radius','5px');
                var text = secondLastWorkday.format('dddd DD.MM.YYYY') + ' is the second last working day of ' + secondLastWorkday.format('MMMM') + '. You should fill out and release the whole month no later than ' + secondLastWorkday.format('dddd') + '.';
                $(this).closest('table').before($('<span style="background-color:lightyellow;padding:5px;font-size:12px;border-radius:5px;">' + text + '</span>'));
            }
        });
    }

    function addEndOfMonthWarningModernEss() {

        setTimeout(function() { addEndOfMonthWarningModernEss(); }, 100);

        if ($('#mainHeader').length == 0) {
            // not loaded yet
            return;
        }

        var warnUser = false;

        var secondLastWorkday = getSecondLastWorkdayOfMonth();
        $('span').each(function() {
            if ($(this).text().indexOf(secondLastWorkday.format('DD/MM')) != -1) {
                $(this).css('background-color','lightyellow');
                $(this).css('border-radius','5px');
                warnUser = true;
            }
        });

        if ($('#monthEndWarning').length == 0) {
            var text = secondLastWorkday.format('dddd DD.MM.YYYY') + ' is the second last working day of ' + secondLastWorkday.format('MMMM') + '. You should fill out and release the whole month no later than ' + secondLastWorkday.format('dddd') + '.';
            $('#mainHeader').parent().parent()
                    .append($('<span style="background-color:lightyellow;padding:5px;font-size:12px;border-radius:5px;" id="monthEndWarning">' + text + '</span>'))
                    .removeClass('MuiGrid-grid-xs-6')
                    .addClass('MuiGrid-grid-xs-11')
                    .next()
                    .removeClass('MuiGrid-grid-xs-6')
                    .addClass('MuiGrid-grid-xs-1');
        }

        if (!warnUser) {
            $('#monthEndWarning').hide();
        }
        else {
            $('#monthEndWarning').show();
        }
    }

    function isInIframe(){
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function addFillButtons() {

        if (!isInIframe()){
            return;
        }

        $('input[id*="hours"]:not([readonly])').each(function(){
            $('<a href="javascript:void(0);" class="fillDayBtn">Fill</a>').insertAfter($(this));
        });

        var btn = $('.fillDayBtn');
        btn.css('font-size', '10px');
        btn.css('margin-right', '6px');
        btn.css('margin-left', '5px');
        btn.css('cursor', 'pointer');
        btn.css('vertical-align','middle');
        btn.attr('title', 'fill / remove the remaining hours from Timmi here');

        btn.click(function() {
            if (fillCellWithDayDiff($(this).prev())){
                $('#save').focus();
                $('#save').click();
            }
        });

        // fix total cells
        $('input[id*="hours"][readonly]').css('margin-right', '25px');
        $('input[id*="hours"]').parent('span').css('background-color','transparent');
        $('input[id*="weektotal"]').parent('span').css('background-color','transparent');
    }

    function addFillButtonsModernEss() {

        if (!isInIframe()){
            return;
        }

        setTimeout(function() { addFillButtonsModernEss(); }, 100);

        var firstDayOfWeek = getFirstDayOfWeek();
        if (!firstDayOfWeek) {
            // not loaded yet
            return;
        }

        if ($('.fillDayBtn').length != 0) {
            // already added
            return;
        }

        $('input.MuiInputBase-input:not([readonly])').each(function(){
            var fillDayBtn = $('<a href="javascript:void(0);" class="fillDayBtn">Fill</a>');
            fillDayBtn.hide(); // avoid showing buttons from other month
            fillDayBtn.insertBefore($(this).parent());

            var dayOfWeek = $(this).closest('.MuiGrid-container').find('input.MuiInputBase-input:not([readonly])').index(this);

            var currentDay = firstDayOfWeek.clone().add(dayOfWeek, 'days');
            $(this).attr('day', currentDay.format('YYYY-MM-DD'));
            fillDayBtn.attr('day', currentDay.format('YYYY-MM-DD'));
        });

        var btn = $('.fillDayBtn');
        btn.css('font-size', '9px');
        btn.css('margin-right', '6px');
        btn.css('margin-left', '5px');
        btn.css('cursor', 'pointer');
        btn.css('vertical-align','middle');
        btn.attr('title', 'fill / remove the remaining hours from Timmi here');

        btn.click(function() {
            if (fillCellWithDayDiffModernEss($(this).next().find('input'))){
                $('button>span:contains("Save")')
                    .focus()
                    .click();
            }
        });

        return;
    }

    function fillCellWithDayDiff(element) {

        if (!isWorkdayInputField(element)){
            return false;
        }
        var essTotal = $('[id="' + element.attr('id').replace(new RegExp("[0-9]", "g"), '').replace('[]','[2]') + '"]');
        var diffCell = $('[id="' + element.attr('id').replace(new RegExp("[0-9]", "g"), '').replace('[]','[2]') + '_diff' + '"]');
        var diff = parseFloat(diffCell.val().replace(',','.'));
        if (!diff) {
            alert('There are no hours to fill');
            return false;
        }
        var currentHours = parseFloat(element.val().replace(',','.')) || 0;
        if (currentHours < diff){
            currentHours = 0;
            diff = 0;
        }
        element.val(Math.abs(currentHours - diff).toFixed(2).replace('.',','));
        return true;
    }

    function fillCellWithDayDiffModernEss(element) {

        var essTotal = $('[dayTotalDiffCellDate="' + element.attr('day') + '"]').attr('dayTotalDiffCellEssHours');
        var diffCell = $('[dayTotalDiffCellDate="' + element.attr('day') + '"]');
        var diff = parseFloat(diffCell.attr('dayTotalDiffCellDiffValue').replace(',','.'));
        if (!diff) {
            alert('There are no hours to fill');
            return false;
        }
        var timeInCell = element.val().replace(',','.');
        if (diffCell.text().indexOf(':') !== -1) {
            timeInCell = moment.duration(timeInCell).asHours();
        }
        var currentHours = parseFloat(timeInCell) || 0;
        if (currentHours < diff){
            currentHours = 0;
            diff = 0;
        }

        var newValue = Math.abs(currentHours - diff).toFixed(2).replace('.',',');
        if (diffCell.text().indexOf(':') !== -1) {
            newValue = convertDecimalHoursToHoursAndMinutes(newValue);
        }
        if (newValue == '0:00' || newValue == '0,00') {
            newValue = '';
        }
        setValueOfReactInputField(element[0], newValue);

        return true;
    }

    function setValueOfReactInputField(element, value) {

        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function keepSessionOpen(){

        // need to refresh after 20 minutes because ESS automatically redirects to timeout.html after 30min. 25min is still too long
        setTimeout(function(){
            if (isLegacyTimeEntryDisplayed()) {
                $('#refreshIcon').click();
            }
            else {
                window.location.reload();
            }
        }, 20 * 60 * 1000);
    }

    function sendActivitySignal() {

        window.parent.postMessage({
            essIsActive : isTimeEntryDisplayed() || isWbsOverviewDisplayed()
        }, '*');

        setTimeout(sendActivitySignal, 100);
    }

    function formatDayTitles() {

        $('#dateRow').find('.urTxtStd:contains("/")').each(function() {
            $(this).css('padding-right','20px');
            var newText = $(this).text().replace('/','.')
            .replace('MO','Monday<br>')
            .replace('TU','Tuesday<br>')
            .replace('DI','Tuesday<br>')
            .replace('WE','Wednesday<br>')
            .replace('MI','Wednesday<br>')
            .replace('TH','Thursday<br>')
            .replace('DO','Thursday<br>')
            .replace('FR','Friday<br>')
            .replace('SA','Saturday<br>')
            .replace('SU','Sunday<br>')
            .replace('SO','Sunday<br>');

            newText += '.' + new Date().getFullYear();
            if (newText.indexOf(moment().format('DD.MM.YYYY')) != -1){
                $(this).css('font-weight','bold');
                newText = newText
                    .replace('Monday','Today')
                    .replace('Tuesday','Today')
                    .replace('Wednesday','Today')
                    .replace('Thursday','Today')
                    .replace('Friday','Today')
                    .replace('Saturday','Today')
                    .replace('Sunday','Today')

            }
            $(this).html(newText);
            $(this).css('margin-bottom','10px');
            $(this).css('display','inline-block');
            $(this).attr('weekTitle', 'true');
        });
    }

    var _showWeekend = false;

    function toggleWeekend() {

        _showWeekend = !_showWeekend;
        hideWeekend();
    }

    function hideWeekend() {

        var visible = _showWeekend || false;

        var elements = [
            $('input[id*=".sathours"]').closest('td'),
            $('input[id*=".sunhours"]').closest('td'),
            $('span[weekTitle]').eq(5).closest('td'),
            $('span[weekTitle]').eq(5).closest('td')
        ];

        $.each(elements, function(){
            $(this).toggle(visible);
            $(this).nextAll(':not(:last-child)').toggle(visible);
        });

        window.onresize = function(){
            hideWeekend();
        };
    }

    async function addTimmiHours() {

        if (!isInIframe()){
            return;
        }

        $('span:contains("Total per day")').text('Total per day ESS').css('padding-right','10px');
        var essHoursRow = $('span:contains("Total per day ESS")').parent().parent();
        essHoursRow.attr('id', 'ess_row');

        var timmi_row = essHoursRow.clone();
        timmi_row.attr('id', 'timmi_row');
        timmi_row.find('span:contains("Total per day ESS")').text('Total per day Timmi');
        essHoursRow.parent().append(timmi_row);

        var diff_row = essHoursRow.clone();
        diff_row.attr('id', 'diff_row');
        diff_row.find('span:contains("Total per day ESS")').text('Timmi / ESS difference');
        essHoursRow.parent().append(diff_row);

        timmi_row.find('input').each(function(){
            $(this).removeAttr('name');
            $(this).attr('id', $(this).attr('id') + '_timmi');
            $(this).val('');
        });

        diff_row.find('input').each(function(){
            $(this).removeAttr('name');
            $(this).attr('id', $(this).attr('id') + '_diff');
            $(this).val('');
        });
    }

    function setCookie(name,value,days) {

        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {

        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function deleteCookie(name) {

        document.cookie = name+'=; Max-Age=-99999999;';
    }

    function deleteAllCookies() {

        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    function getSecondLastWorkdayOfMonth() {

        var endOfMonth = moment().endOf('M');
        switch(endOfMonth.isoWeekday()) {
            case 1:
                return endOfMonth.subtract(3, 'days');
            case 2:
            case 3:
            case 4:
            case 5:
                return endOfMonth.subtract(1, 'days');
            case 6:
                return endOfMonth.subtract(2, 'days');
            case 7:
                return endOfMonth.subtract(3, 'days');
        }
    }
})();
