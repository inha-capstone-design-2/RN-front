import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import axios, {AxiosError} from 'axios';
import {customAxios} from '../utils/customAxios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';

type ProgramDetailPageProps = NativeStackScreenProps<
  LoggedInParamList,
  'ProgramDetail'
>;

type Program = {
  programId: number;
  programTitle: string;
  channelId: number;
};

type Episode = {
  id: number;
  program: Program;
  description: string;
  startTime: string;
  endTime: string;
};

const imageUrl =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFBcVFRUYGBcZGxwaGhoaGRwcIhokISMcIRwcHCAaICwjHRwoIhogJDUlKy0vMjMyHSI4PTgwPCwxMi8BCwsLDw4PHRERHTMoIygxMTozMTExMTExMzExMToxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEAAIHAf/EAEMQAAIBAgQDBQUFBwIFBAMAAAECEQADBBIhMQVBUQYiYXGBEzKRobFCUsHR8AcUI2JykuEzgiSissLxFUNj0hZTc//EABkBAAMBAQEAAAAAAAAAAAAAAAECAwAEBf/EACQRAAICAgICAgMBAQAAAAAAAAABAhEDIRIxQVETIjJhcQSB/9oADAMBAAIRAxEAPwARwRwt1DO5y/HQfOK14oPZ3nG3ezfGD+dDcNdOYEbgyIHTat+0nEFuXQyqyjLHeiTB3gE9a8xRvR6WZ7stPf0obiXrxL/dHlVW+9aMNnOzUvWjmozcrxrlWURDVt60uvoByma0aSYGvlUtrh9xvsx4tp/mqUl2zbfSIhrUeai1jhce80+Q/Oq1zhNzUrlYctYJ9OvrQUo32Hi/RVVwa8Nmah1BgiCOR0qzbeneuheyu1oirGGxToRB+dSnUV5ZwxbvKpImCenP4xyoXa2aqC2H4nmIJMMPSiJT2pgvbHLUAT8tfKla/aKsQd/CpbWKZfEdKk4eg8rC/EuCW0Ei4A3MbD4CSKM8Bw5S2oO9AbNxGHgf1tTFw3E5Y0zdIOlJKW6YeOgP2hwDnEMw2IUz00iOvKhVgBmAhiPvbDz15aU4YtGuNmYBRy/QqLhfD7eluM+XUT0nX5H4iipW6Nx0Cv3VCB3Qeh5/nUF/AlVL8hrB0+FTYzHlHZEXLBKxEEctZ5/CqOJJMySfMzWSaYdMlturbH0q1bXQeVCIq5axbDfX9daaxHj9F0rqPOt8fci2x9PjVU3XuELbEHck8qziguKns3ie6Z+8NZOwG+kUOzKDQOe4xEfSolEVc/dmgwpIUakAmPE9Km4Xwtrz6yEG56/yjx+lFDPRZ4LhWcTHdn4xyHh40wYm/wCyAt2xN1hoPujqfDoKuHD+ytn2aguBCry6AeU71rw/A5ZLHM7au/U9B0A5CqKNf0Rys24fYIQTM853NQ4jHKSyaiNM29SYniSKxtyVIHvRIE+XMeRoM2BcyyMHB8f1+FCUqXFGSvbLH7ox1Rg36/XStCjrqQR4/wCRVRrroe8rKeR/zV+xxJufe8/z3qWvI1Mxca45z5/nvVq1xFftAjy1FaM1p/eUqeo/x+VQNwpjrbuBx0O/y/GKKcl+Ls2vIWs3Eb3WB8OfwOtT5KWvZXFYA22kmBGsnwI0powmEIQBmM89Tp4DwqkZSfaBKKXkWcClt0DoAesnb0NDuPcPP+opBH2lB93xH8v0+lHDYk2rkBs1skHzU84+8KYVQnUag86g1xdnS3yQoSdq3XBXG2U+Z0+tM1nCZCSohegG3+K2dKzyV0LGF9i6nBz9pwPBRPzNXLXDbY+yT/UfwGnyol7KvGQQTO29K8kn5GUIoqlANAAB4CK0IgEzpzrfAW72IBa0i5RMAzJjpAia0xNn2lvu84PzEig009mu+jW1cVvdYGOlSfWi2A4PbWy+oLZMwyjnEifCZB9KqXcA6qGZGCnYkGD5Has15XQE/DKGJ4elwd4a8mG//igGL4c9vUjMv3h+I5fSmkAivTrTQyuP8NKCYoI9OPZvh9t0AEsG1I/mXYeBiR+pqxwrstZuH2jyBr3BoDHP/G1MVnhC23Q2+6FiRBiNeQ6b1dpyVohzSdM59x+0oxF1UBVQ0AEEEbToeUzHhFCzarumMwdq6sXLaXFk+8AdJiQeXmK5V2t4OMLfyJPs3Ga3OpA2KzzII+BFPKDjsWMk9AEGIph4Nim9ndI1yhSTG29AzannRPh5ItuoMZsoI66mOVRnTQ6GbgVr2qm5c70mFB28THnV1UVMRbVVXVSToZ8Oe0z8Km4fbCraC7EDXroAfmSa1s2y2Nnklv68v+b5VWKSSX7ETttv0y5xPhdq+QLi66Q40YHlrzHgaSr/AA8BiGGoJB8xRHi/aC/7V7dohAhicoJ0id551Xwl97pc3CC2hJHjO42G1TzST2uw400tgjEcPYarr4VUKkHXQ+OlOaYEMutL3aFArqg5LJ9Tp9PnU4SvRTkZwczmgTBUz61e49afLZTLCakkeLECR0gHXxqPhGVbCzP8W+F0Md0BZ25bj1q92ldjdAU6qnLllDNPzqyhonLIyxwfBIy3EDMpZSDGp10J1EH0FXbyW8LbECTsi8yf1uai7PPFu5dYTC6xzjMY89qs4fANcb2l0S52XlbHTxPWslSpdg7dvo84YrMmZzLNEkDTbl4Vti+I27TezJhomYkDzjWfSlTFNcuYq4C7pbR2RANAMpgQNpMT61BibNxmaC1wiDnncNqB4nf41udKl2Hhe2XMVw+7JuIwuA8xH/j51Q9u6NqCreoqOzi3Q6Flb4fGiVri+bu3LauOux8+h+VTr2OS4fjB2YK45zofiN/UVaVMPc2m03y/L6VU/wDTrFz/AErmRvut+R/Amo34Zete8mZeq6/KJHwob/ptfwIXuFXVGZCHHhofy+dDmulW7ysjfA/nW+HxzIZVivkfqNjTRwhLlxQ90KRund1P8x6eEUVFSdILbirZvwqxcCA3GJJ1AO6jxO81O+IAMTW2KuQMo35mq9uxpVXPjpEe9s5haCowz6g90npPMUW4BxD2ZFu4e7OUnp4+XPymheLtiK2wyMVy5Y5httf/ABUpfaJ0rTofWtAba/rw/Oq93CiCw+H5UNwHEri2wpQNGgYmAB0J2MedQY3F3sjkPBgwEH4/5NS42Bck7LjRMSJ6VGyAgjkdPjUnCOz+Ee2Tce5n01DGQdBIAEGCRvO9HezuFCFvaAF10zdNN/CfyocNqmPKdLaKHArvs0FsCMk/ZmYiBtrEHQxrVbAcLa5cSRlR5IbcROsEaTrFEuOFMMGcA/xc8c8rkTp/Ke8fAjx0vdj8Qj4QKN1LqwPJsxYH+1lPqassbatkJZvESH/09sJ7SWzI2YIdZBIJyMNhsQCPWNJk7IXEv4Q2201dXH9RLKw8tvMGp+LE3bFy39rLmXrKQVIPiAvzpT7KcTa3fEmRcUqR46ZT8f8AqNdEFDg6OWUpc1ZFxGLLtbuMFZSQdd/EDeOdDrGIvXXy4eyXG2YgwfpFMPbTgYuYpbuYKty2hbSSWWUPh7qrWcDwyW2W2AxBJG+4IOug3DH6VySUIOuztjKU16CnC7p/hq6ezeSjJOxEA/GZ9aIY6+baqRrrljwIMfDLWuMwp7l0Lle3DP8AzCFVtecBR8Kn4/bHs56MPxrpi3wbOWSpk2AcG3azzqFad5JAJ2560A7f4dbmDt3dA9txuCJzzmUSNTIB9DTNwpFeysgGEWNJjTKYpd/aBLhLH2VAuEjmTIX4CfOaeUlHHbBC3I59wrCNdcqiljBMCOXUnlOlF8Bw/KzZpBgaQZ1GoIGgYbakCi/ZmzbRB7OQ5zBiuuoB/HYf5qhxO8jYi8bZOUvr4sAM23jXG5WdkYOxl4Q6uiIN7Z8PIk/3bCpMEAcXiPBbY+OtC+zyQQw+0wX0ET9aPWbNv2l1wNbhAJ6hQAo8tSfWujHK0rITqMmkCeJWLVvESvsznjMNNNMpHTXQ+h9Z8dh2IUhdAoBZRz036bc6q8bsW7d61JyBwwnkCuUrvy7xHrRDgfECwMFpfMZgwACAonYEgs0eIqbg5Saeg80ooqYXCuw0ePCP80k9oXP7y4JnKcvwEH5zXUnRtGtomY6ONhrqDpz0Ncq49ZuLiLpuIyFnYiQQDqfdJ3HlQjj4s3K9l3AaphF63Gb/AJ1H/aat4/HKpxFwrLN/CQ/dk5Z1/lWdKEcOxSq9oloyTprvmcgbazmX9CrHG5LW7aLMsY13y90fMGq3Qj26HjsrhiMKP5mYjymB9KIXbiICJJPMDU+XQUrYPiOItLbs3FUI0KrL72pEgkQI1nbbnRxIj1/GnhUugStaYuDM15tIJuFjA8Z/GtuL4TE2/wCLb1tBROUzoN86kdZ5ECrXEj7K60KJdQQem6n6Uc4KM2GQeLp6SfwoLD3Y3zp/VCQnE7Vzu3rY/qX8p09D6Vs3B1fvWLgYdDuPxHqPWheEQO7Iql9DlaY22PTXSvMhQK4Yg84MFT0kVCmVNsRZuWzDqR48j5EaGiXCcbiC2S2Wb+U6/Xb0Iqla4h7Rgt3vZoGYHK2um+zeo9adOE4SzbKrbXKftMzSzdNdgPACsu9mb0UsBw329zPcVlyGGBA7xH2ZgHzmaamIGnh8K8vuqba/r51XtknU7n9RVNR0uybdkaW51POquI4sLbZEUsBuR15iqnE+LZZW2fM/l+t6zh+FYWwTu3ePrt8oqXKuiyxatgNsHbTVv/r8z3vlUD4i2vugegn4s0wfKKheJk6+etV3MmYH686mmivFktzHsT3VB/mJzHwGu48quWcYXZES3nZrZtsJgMSQQ2nSDv8AhVTA4f2lxUmJME8l8T+XWBXSeCcDtWQMoBJ0LHf9eFVhBzeic5Rj3tgPhBYXBbJCsFKDrJggjrsPgNxTHa4HcXPLoxcsQdRoRpy5UH43xNbRhSFe1eQEhQWNtu8MpO2mnmvjTDwviYu23MjuPcWeUAyp8srCrQwxV2QyZHKhL7aB/wB2AYQ9u6Mw/wBrfXMPjWnBOKWBLW2KWxbtC7nJAVhmCgZiZMSuke6KP9vMGbmEe4mrLkLRrIkQdOk/qK5Xi8LcCWoVouFjlyn3pyxHPQAj+o9aMo8Y8WTirlY/YTjtm7cyC6vtAxybgMCTCkkROv6k0n41vY33XbJcBHIxMgfCKkwPZ67cSfZtnzRB0mQYPgJWPOt7nF3EXXt22uE5Bcjvd2InqdOWum9Jj1fHY2SK1y0dBxeFW/7MzoqkadTrH660Px/DMhtFCNZAmRJHeEeJAb4VrwLElsOtwd5sxDeZM/iKIdpkJwzMphky3FI5QRJHkCaLxJ2n2CORra6CXCMT7RLpYAqrBQInUCX+bZf9tUu0zgWl1gF1G/gRUPZe8EwNtmnvs5Mak5rhUec6VT7Q3hdwl5oIELlHOSymnaqPEW7dhTsyM9oDMYkiVOujzoRSucKcQ9y5ediSx7oIVT6KBO1N3Zi3kw1o/wDxK393f/7qTLF/KtttQGIkEQY1Mkf7anl6SElJqOgxwvC27eSGZMvdIEQRGadNjrGuk+tR3+G2blxmVBbZmzd3QS3UbE/Cpcg3BEE+Ogga1OyBRaYzLsN+gDH6AH1FTjFMT550t9FDAPECMpWfLfefOieYh7YiACJMyGkqAR1216T40i3MS1q7cuLurtMcxm7w8iKeg/tLSXVbur3tB76eXUGG66Ec6eCaVHRJ8nYE7dp/DtN913X4hf8A60T4IuWzYEQcoJJU6ho1Gmv2RPjrVXt7bJsW8v2roA8yHj8KM8Ruph7BuMTltLlgHc6Ko852q4qNLrs1m8yjvjvLoT7uoAjmRPxrnPaE3WZblwMCxO6kTsTE77/Oj69psQV/0reQwSBIKr4MT8THoJoX2yxSv7Aqe6UZ/wC7LE/2n51zylclRaMWotMXsGwFy2W0UOpJ5aEGmfDXA0tlcqJAYCO9JYgEjoQetacOwFo21W4gLqCxnq2UkETBIGVdZ901riMNcBGSYBlVmAJ3y6wNhtRkrQinFSGbC22uK+XMWAVk9oZUMFO3TU8qmwZ0Ua+M78t/jVPAY4ovfgnTdpPLn10qxZZzcLgBrZMd3cdCRv5n1qmNcYoEpqUnRX7QrLW/FW+RX8zV/hIIwmgPu3HkcvegjxqjxBPaXypMKi6nxJkgekVvizmtjDqSFYZYnkBrJ59PWrSkkiMI/dyFvBW7a6qrKckZl35cqr4+zZRjb9o3IgwGCmNQ0azPnFS4bGG0rXGB2OVTsW8RzgjWiPafgFrJcuWu4yDMyD3SNzlnYjeNtK5IwbTO2U0qQvWsAxdBoyMwBZTIjnPMacjT5gkDOPDWkjstYZrheDkVSJ5EnYeOkn4U9cFtatPWPQfoUtPlQH0XLAznMZCjbyoXxvieXuJv4ch+f0q1xriQtrlXc7D8fIUs2YAN+7qoPdXm7HZfxJrS9IfHFflLo2Sw0qDu0H+kfePTTaj9viCgaLM6+XQeggUr2MczOXYy7gwOQ2X6E/AVLeugGKRWug5HZSfw1qNLeaTyG8fSevlTB2i4av7u8KAVCttroROp1OnXxoJwXDtcd8sahWMid5k/EfOm+Lh+Q0s3JfUP9m8RatL30YzuAhMiQCT6kb9aY/34JcKpPcCsBtoZIB9FIoBwS0Rcyt3e4y+c6/CYM+FGbHA74xF282V7d0IVAPfBQQyspAE6HYmnwJ26I5qpC326uK2IBG7W1J+LD8BU3YjiORmsk/6i93+pQfqPoKCdqLhOJYGQUVEIO4JGcg+IzAUNw7EQQSCDoRpHSKq3Tsl4OtcevMMDeIkMqZ9SD7pBIPoCNzvXJ8LxF7t4EgQBsJMRPe1O8nfyp+u32xPD1tpGe7FstO0HvkjnoNvEa1Nh+yNu3aIUE3CqiebFQAvhrlHhvRyLmtLdBxycXV6I+D4h7mY2zmuezAVZIMrJEnaJ5/KlHi3ZvF2rGa5aPcbMxUq4jUE9wkgazr0pswzLh7YvKwyl7eq6DRgWBnUHKGBFO97Ruqnl+utL/ni1F2b/AENSkv0cr7HYwiLZBZbhgj7pGobyjf8AxTvxCxnsOvM23X4qR+vKlfhWAbD8RawBFsZ7yE/dICqB5GVn+U043tEbwU/SqRt3ZKqA/Zu37TB2FIGX2QkzBHeeY05+YpZ4txl7l67Ysp/DVyD1dg3eMnRQG0EfHWmjsm3/AAuH/wD5R8GNAcDwe1buMHuHO92GI1nUtM8gOem/Oo5XSK4YpvYRs8fdcOEZMt1SqEDkMrQ0cyAu3lQXEp7Sz3AZUBhsJAh+XOCdKJYm3bF+0JzP7Ml2iJ3C6TvE/LrQPs6+UtJnvBWBPgeZ05VNtumwZUlGSX6LuDu9wTOm+vKiZdjctKxLC2mhhRE5RodJ0Gxk6UKU+yZkn3SY/A/CKuYZs1u7cmBlYKw5ALDfAifQ1ovwcVPwL3F+L2DnVVzZwe8FAImeZEzzol2I4mF/hAkiSVnlvmA10n86GdmcIyXHbIHCkDyESSND1FM3EMGjXLVy3bKXFuorGAAykFpMbkAb+JoRkoy4o9KULjyLPa25mtYUdcQnyD/4r3tzP7m0+6HRiOoLAQOp1qPjyF1woGwvgnyVWJ89qI3sGt1gWUNG8iZ856HWulu0c8XTsE2UtC2zta/hqCSYGoidRHUCBv8ACkC5/Ea0ughIgztnuMBz1ykV0TAW1F5bYYuRLuOQCEgT4lo08CeWsfHOD2GD3kQJdtg+7oGG0EbTGxqOODq2XyZF0hZwuJi9cDc9j46k1fu4uRtHrQNDN64fIfIH8aI2EZyERWZjsFBJPPQDU1VI45F52C6NKNH2lMHfYqDNH+x+GS6odrkS7qwLoshfdKAySNwSY5RIM0mY682uc95ZB7oWNSTIEayTNWuzdskFVBY5dIIk6aDTUHX500TJbHO9w6290KHkXEzmHXNuFJ7qkRsRzI6Qaq4ngFrOlwX3zJBAzhVBkZgYU7iRsdtI3oHxDBPbVluCHRh3SNV1ncATIM9NdK9PDrqpmuJcRTJAZCoOrRJI8ZoNlUeXOCYU3XZ8SAEeSvtLZALFyV5FSAoMECYIEzoQ4qqt7dVOZUS5OsZoUwJHWd6HcM4Fba0catwXC7XbVy2QP4bZpX4qoMH7wrzF4wWbTuYAKG2inmSCFB5ADc6nQUZbDEi4GirbGQGGObWOfWPAUwPijasg9dgN2J2HiaBYbQKqnQADQchoDUHHuL5LiqpHdXSeU/jA+dc0X2Xq2bXlZnm4Y+0x5KB+ooHxjibXGyqpCr3UWNR6fePOmPgQF3USx0JJ0APj5ch60yLwe0Dnygv96Pp086pDHqxZZN0I3BXUNcL+8iqF+LT9BVW/eJYmoncpduqf5gfRj+dR56CiZy2Mt3F+2b2Qkm53S0k6RqfHQU8cH4HbtWwlscvU6TJPM6fMUlcIewLttf8A3ATrM9dSPL510TDAi3I0KjUfQjrrz86fHcn9gZGuogHtTdazZt3rbQouW85ABOjAaFh3TMfCmXh2JF2zmU7s0Ef1Eg/MaVSxlhLtprbLNu6pDqOX8y/zLII/p8qH9hn9lYe3dYApeKkkxJIB0nruKvGkRewR+0zho/h4pRqf4dyB6oT81/trnwY5vD5/rwrtXGbC3MHfF0ZUNp2PMrAzBoPNSoPpXCAzTHkYqeRbKQWjpPZC3ktq335J/A+gC02YbF5iCeRK+W2vxn9CguCtC3btaSFDKR10GnqB8q37P3CV13ZQ3qpI09CaWDrQGAu2Vg23ugTkuL7XLyzGVJ8wZ9HFPNnFF7Vl50KK50me7t4DWfQ0tdssOWRZiB3QfC4II9HVD5Hw1K9n+/hrAmD7NSPSVI126HQ7Hbert2iKVSaLN5AzW7hXvDOobwaCVPqAfjXmLb+G/wDS30NacVx4tPZS4QqXCyg6Rn0KgtOkjP8ALapXOkUo4D7MWLn7lZ0Ntwre8NYLMV0O2hG/Xas/9OvLezlQVJVjsegO+x316GjVq9skicsx01IE/L4Ghvai6y4dLqMVKtlYzsG7rA/7guvrUpQ5jxnw2FMLg7F+2bj20LZ7lssvdYgMQO8sH3YFKKcKXD4q9aHetXLYu255Q2g8xLCR0o72Gv8A/BNIJK3mHL+VvxrXilgM9m5IzIbluNpVgx9YKD4mjOKSoVOxYYq0LcXNyVtQRGuViPeEDfceuhXFXUTDN3dbhFsBBGm5VQNhAM0J44cl/C212/iMY592BPXc044HCqLcAy0az84rnjj2O5daEi5byELma2GEnvTGuxInp6UexOHxfsxctW/3hSQSM4BXKsAqDqZDHb4a1nFuDJ3bmZlJOWIBGxYfjRng2Nmw77y51J6ACfXpWhj+32KzyJwpC1w/GG/7FLiG263bkrrI/hXF1kSDLfSmHD3Pe01BII9T/j41X7R3ABYxGWWF5LZYbwx59YAPxqxflS5+yVDDzE5vSMvxNdEU0QlWqA/C1SycTdb/AN280afZUkD/AJi3y6Vrjbk27kfdn4kCOmxr3GYVrgA0AI1PMEwSQI6zGo571DxZ8lkKJYuQpk8hqTMy2oHxoSfkyV6DfD+z9i7wn2gtKbxS46uqy5cNcyrKiWH2Y6Uv8Cwl7CYhMTeQ27dozcL905WGQwNywDZo3IU1NwvtjiMLhvYLbtsQWyOSe5JJjLs8EmNRy3jX3srhb2LxC4rFB7ttDC5lZg1wkBR3FIVBOYmIEa06knVCyjTLXaTsW37x+8MVu4a7iEDoGZWC3nCkyPus8iDrp40RxWFwtlsE1qwbL4i4EAkk5cywWk7wQ08vGkzjvGcX++C7fZS1q4GW2DmtoQe6AARmGnvbmmTCYlcWuGxeJxtlblq/mFsuoAQfYCKMxuMVBB10jfaimm9Aaa8B3tNwu9cv3L1vIiW0TvPpmMkkz/KCPgBUPbl8ULb5riJhktgszaG4yjMTCqYk6AaaigHb3iyXW/g3rjhiCbZBFsQI0B1LE6zEUNwXFMMjG5xMXL0AezTvvLA+6RmAIgbN3dKz7ocK9hr4wnDS2KshvaXhcW2xXMysgyuVOw7hidxr0pn4EU9k95ms2muufZ50XKFWAwVZXnpvyB1qpgr2Bu2L2JbB5FzEZrhBe450Osk5hp3pMelULHHU9ilt8PbuMgKozbAf0x9CKzYUjfs52LuWMU7G6Llp0uKCAEDZxrCS2gmJGlJVns3mbNcLR0PvN5nl9fKnLs3xJbV4u57gR9B10ICjqdo8a1wCjE3RbkIzknXXqTEbmJ6bUOKa0HYPwyi2AqAKo5Ci2GxE1pxng74YjMQyMYVh9CORqgjwZFKrizdiZ2uw/s8U/IMQ48m3+c1Vt2jFMHbexntpdH2O63k23wP/AFUKsYo2VVCTmgFvM/4ill+h0yjhy1u4rAaqwYDcmDMaeVdmweNVlgHRho2nOK5nwq+otTkTMCQxaddo+X0ph4JdNxWl4h4EbAQNBER1pYNoXJVjQX2y6b6dNT+FKuNDLi4toXuFBcIG51Kk6+QGnwphWwAuYNMGOWn4j/NU8PC8Rtkfbw7r/a4P4ina5aYsZcXaKfbji963gktsmQ35Vp95VXKSNObTB8J5mua4lcvsm6qDrzg/SukftUE2LDdLjL/cpP8A2VzzHwbVkjkCD8v/AKmhPUkikKabOndn8emItknUMIdPu9dh8DW2GwzYbIpBNpWyo41hW2VukTAO2g5mud4HiD2ER7Zh9vCNzI5g6D410zhHFreIsFgrQe6ykDfTMPECd/CjDf8AwWSoq9uDGFzdGt/NgPxr3snjgbSDnbcgx0eSP+bNWds09pgL2XdMs+QZWn4Uu9jMQTcXow73xEH0gj1qt6ZCX5Jnn7SOIE3rdke6i5yORLEgadQF3/mNX+yd64TcZ7jm2qoqhnJUSZMAmAQB86Xe01tmxV53IE3CoLGIAOVfQBan4Dxh8JczOCbVz3hG41IZZjUSfT0hIyTtDzi1Vjvh2Y4i5oMoRQDIM6tB05GT8PGpuL2vaYa7biQ6P/dBdT8RHqKsWFW4qX7ZGV13j3lOx+npNTYNw+ZSIZWyMsg6wpERyKsD11opUZoXf2e3f+DO5m8+2+ipHlsdSQJirPGLxF7D2lHc77t5hSsk+pql+zTEL+5ZZ7yXXVv90ET6ED0r3tPijbvYa4rhULZH25sJBnbukn08KGS+IYJWUuIcPd8XZfQKFeZ32I+rCmMsQFfo65vIsP8AE0E45dy4zBsHhWLqRmgNpC6c9WAou4L23VCuciBCxOokHUCfWpJUGuip2lk4W51XKd+jAEz5E1Hw3EBcJJ7oYs8dJOg+QqS1aNy3dt3WaQIYhCpgzr3iQfd38K9x+CsOlv8Aiwqr3YIMaDWN5AEep8ablcdA4VPZKji5h255WRgI2hgJn/dVfjeMy24kywIUxp5eJ6DwqXBhLdu4iEmRqSNzOuuwI3iq2Oth0hoIkab/ACoq+P7D9VL9EGB4itxiAwzaHKenIiRr/iqvG7nfWSPdMfkvjWuBCByVEHbamz/8DsYn2V9r1z3NkyxrJOpUnSSPSl4uaoZSSdo5tduwpZvdUT5nkvqYFQ8M4lda26m4wUMCVDEL3h90GPs866/b/Z/gYAdHuDMGh3OpG05YkeB0NLXb7gODwqq9i2LVy4wBRNFKiZbLssEgaRM840f46Qtk/YDgFjE2L1y/bFwtdygmQQFVdmUggSx26Cl7tj2BTCYizfsMRZZ4ZWaWtkAsApOrIQI1kg8zOj5+zNIwbeN1yPgo+oNLH7QuK58QUUytlSsT9owW8yIVfCDR1GKZrbexaySS7UPc+0xNtDsitcI8Tov4mjidn71jhz4rG3BbYAGzaec7E6hH5hmEwsSu52ICPwviFxsQr6Et3SNhHh5b01UKPWMv3BbRHzDmgaYCnYqDpB6jer3ZjDriLyW7jFQZ1WJJAkDUQNjRnjqtf4Vh77KPaIQJAjuyU5cjCmqHCuFXcLdwmIcA27jJ3h9nPsG6GDPTlWrdhTJu0fBf3Rlh8yvOUnQiIkHruNaK9g8BNx7zKRkGVZHNtyPICP8AdTRxfH2bAD3AC2yACWJ6LzH0qbC3LjWQ5VVusubKZABOwbnpoD5U1bNYk9uuLs1wWkIKp7w6t59QNPU0s4bGq5y+633T+HWiHGsC1m6Udw7kZmI6md/GgmLwQeI3qc0+x40X8a6i2+cSsag8/D40h37pdi3U0W43dv2lezdV0YEAK4gkblvEbQfOgdKYIWLpVWQCZI16RP1mmbsoT7O5J+2D8qBG4g0Ao3wBybdzzH0rnUmUyJUN3D7wIZW2Ya+FVbqlcZYJ2yXl+IQ1Hw99R0Ig1YvW5uWjM5c8TuJXb5VeMjnop/tAXPgj/JcRviSv/fXLnunIF5Az9fzrqPam+hwV0vscmnUh1IA8SR+NcttCTFGTvZTH0W7xVQpDBlI7vhtvyDdR5HYiuhdkR/wdsjmXP/MRy8BSXgra5SrA66EdfHTnXQezqAYZAogd6P7jSQknKhpwqNhXCorq6OJV1Kt4g6fiaTOyOCa3dxKvr7F1tgx4tJ9QFPrTjww6morOCC3MQ3/7bit8LVtf+pWq/giIvadkXEXWbVfaTt96D9DQDjeNFwKqNmUGZ1HpB8aO9sLI9uwbmFb5Zf8AtPxpbOEB2J+R/CuaLSbv2dEouVNejpn7OLZ/cgSTrduZZMwNBAHIZgT5k0xWbSWmJQZcz53P3iYBY+Og+FB+xljLgrQ599vi7/hRYhWcjeEn46fia6F0mc77oRuwitbOLXkLsR4p7Qn8Ko9uVIvBJMQGgnSYC7f7TTJw+z7K5iz9681z+61bYkf7magvayyz3LbqoaUgkkToTG58aSbXbDG7pCxgOHNcuW0Yd1mVANToSBp0GtdLxGFIclCdRMEnL4aKRSv2WwzHEgsrAIrNqNJ90baT3vlTq7/SstqzS0wFa4w6srEZmuFrWWNsmY9ZO3zFWi73F0t2gSW3TcAxpuJ3ofxqyVxGEuAdxnuByORCyCfMCjgWEXwgD/d/5ocTWIfbdnsYlUtuyr7O26gMe6SCDHwPxobge1GIVwLj+0TUwQoOxjvATpvrO1E+3+uIRv8A44/tZqXcTw28pRmtsJgAxoZ2HnrtVFxA2HsP2gSWcW7kAiR3Yk7a/HlTd2V7Y3rYcNaDWd0GeGBnvkEiCPCBrPjXN7dmLYEkObklMrTpoJ0gATPrXROx/CnxBW06AW0ALsG5chtu0HbbU0rXGSSGjuLZ0rhGNe5ZF64oQMCwWfdXkSTuSNZ03Fck7ScV/fcQzqDkByITpCjYkeM5vWm/9qHaZcNY/dk/1Li6gfZTUa9MxBA8A1LfZLsliXt27pyMl1RcVw+ihgCFYEAhh0AI8TTy26NVDf2Px6W+Gu4I/he1JPUiSCfp6Us9l+K4NLt/E4tlDKTdts07sWLZV1zXJIjc9KOcI/Z+yI1u7inNt4L27YyhiNszNMx5DYVz39oPAzgr1u17TPaugssrDALl0c7HU6QBWp6BZ0ftJ2cscaw9m9bxLooBKMO8uujBkJEMCIOoIgiua4/sg2AxaJ7ZLpyFzlUoUmQuYFjvBiOh8Jk7Hdp7+AJFtfa2naWtEkAE/aRoOU6a6QfnVPivaZ8Ribj3rOU3GUBF1KAAKAGIEmBM6bnlRck9Gp9nY8ObFvh1n95/0ytskZS0kw4BAB50s9p+1vt0azbTLb07x94wQRA+yJA8fKqnavtLaxFu1Zsq6okE5oGwgAAE7dar9mOHWrpuXMRcCWrQBYT3mmYA5xpyE7AUKb0jJoOYbtcntluvbLk2lQ7TbYFsxWeTSDv06Vb4hxzEYuFwtu4tuO80ak9MwOUL6661RXjPD7J/g4QuRszn6ZixHwFGeFcfxOLLizbtoEEy+Zt5yrpGpg68qZWYFYfshiHjPkSepJI+H4E0f4Z2Rs2iruWuOsHWAs+X5mltu1+KMjMqnwQaeGs0t9r+NYl8OxN65oynusU5x9iOtExp+1/GWrmLti24d7dvJdCmQpzEqpI0zamRy0pCBqsjbjxrY3KRjB5hJo3wPG20tsjtlJadQddBzHlQlUqNnrjjsrJDvwPFrcJCT3CNSIBmdufLnRDiHFLVqM7jNyUEFjOm3IeJpDw7EKxBIkRofWqKDNv1qiVEqLvG+MXMR3GCpbVswUSeUAknfnyG9BLeIK7AeoqbE6SOpqqaZK+xlroupjjOqg/EUbwHa27ZTILaMnIEmV6wRGnhSygrW5rWxxSkbJJuI4cK7W3xcV2yC1mOZVTUjQGCxmddNeRqx2145cGJtLhroNu5aRhCqwzF7qn3gSD3QCNNqWbLsLaguGUSV0gjqPGhd7FMtxXXQjUHf11ql/dx8C8fpfkYuK44tc/iPLQAJHL/AMzVJWLe7l+IH1NR2OIq+b2ipcMAKYgiCfDbvVUuMCdD5jpSTxpttBhkkkkzqfZ3jVhcPbttcUOiwwMjWSdDsQfOiPDuI2blzuXbTs4MBbikmN4AMmK5Tw9O64k6ldvXStQ5N2V7oRYEGI1GoPWq1UE2RtynR03i7pb9oztlXKCTHUZQB1YxAFI9+8924ziQNgDyA0A6HxjrQLH8evYlwbtzNAAEaA5ZhiBoWg6mtTj7nJj5VLJBvovjaTtnQ+yds/xWJmMi/Un6CmFxpXHbPFrqGVcg+BI/6a6jwTEu9uHbMykQeZEDf150YRajQmWac79lHiuIYYnC2RGW6bpb/ahKx01FFEJnvfZk/AQKXuM4tV4hhi5hU9pJ3j+G8beLAVSxvFbl5mVVYWzsvMgc3P4bee9Zv68vQElyUfZnakW7hSGBZQ0xrEkEDTnUd/H3Lnsz7EkK2Y5Z70AjSRA1M78qppisKmtwkt92Dp8tfWosTxdH0R8g8yD8ag3Jvo6lCFF7j/E7bi2MhRknuAgmTHvET086p4XtnjbUizdyBiTkVEYaxr3lJJgdaoW8DmlxcUKNzm1PkDvUF1wk+zHmx39KpB7JSVLQUdnvM13E3C7Ea5zJ9Y0AHQaV0TgnF7lvgXtMM6m5YJXvCRAu+6QYP+mwrjZdjrJPnXTv2W8Sw/7ticLiXRUa4GhyFDB1AKyT/wDHVI6fYr2tjvwHi91MD+9464JcG7lUABFP+miDcsRB1JMtE6VxDtNxS7xDFtedSBoqITItIDoJHPck8yT4V0Ltx2ttXk/c8JkZNM93KCqiNFtfzRpmGgGg5wloiIMojxmdfOtOdaDGHkv9kuzVy+727Z0gF7je6o1y+JJ6U9X/ANmylDlvnP1NsR5aGQPU+tA+yvau1g7N1ChZ2bMpBXL7oADE6iCOQO9bdl/3+/ibd0XLzIGUu7s2RlkZhr3TIkAAc+W9CPH+sErAPFOF3cLc9neXK0SCDIYdVPMecHwFQK1P37VriZLC6Z8zHxCxB9CY/trnCvHOqcknQnEIB9K6l2dw4wvDzcIhjba80/0yB6KAK5z2T4ecTirdvdAc9z+lYkephfWuodscWLeDvE/aX2YHUv3dPIEn0NOnewHKkucz/wCaj4gntLVy3zZSB57j5xUAuVrdxWUUQCHmg1qXqzxRB7Vio0YyPPn8/rU9jg8iXfK3TTTz8aRtLspVjc+HtxzFUL9heRNX8wO4+Y/EVFcVTy/XpXnxdHXJJlG28aEwP1rVJyVOlErmGB8PHpXiYRObzVfkVEPjdg27L+fLQ16OH3N8s+o/OjdrCfdYRVhsOUUtBMchSvL6KxxexafA3AD/AA284n6VpaWPsg8yDRPEYpjJJgfdH49aH27oLNJyzEHlz3quKTvZPJFJaLgsrMD3Ok7bSdZ+HlQ/idpFaF+ev60rwvLEBp6H60QwuHtt3WAzHYlRJ/GhN8ZcmaCuPFAQWx0qdABsIo6eELvt6mtf/RweY+P+K3zRN8UingGPe5bfjXl11AIXXkW6nc/hRDD4IW5DzlIJJnygacqG2l+yNhqPWqvInDRKOOsmyjg8JIc7kcvDrWjaEiid7CP3TbYKRM6xv6VUPD7g2APkw1pVkTW2NKEk9Irs+hph7QWrncuI5EbZTBU9QRrNAXwdwbofhP0q5b4uXUB0VnVdGOm0DaNTH0qkGqZDJCXKLSM/eXu4gOSzMqiZYmdxqdf0KLXMQ622E5ZEwIHI8xSxfXvZ0JBA32mr2Guh1ctcCnJopBJuHXXzA/KlluFIoo1k5MolZ03/ABqRUVPe7zcl5DzNeC7Hu6ePP/FRNWCe3rpbefwojiUmI0JAPnoKFTpRNn9z+kfQUs/A8PJGlkn3tpquysXKrO/oKtu8CtLaMrEnSY0rQ2zT0tFrD9wbknmalGIPQfCqbXBWrPIMGn4onyY2cHw2JS2MfbtqLdp/eYqA0HKygN7wM5dOcxqK6Nw39omEuZQ4e0TvmAKj/cp28YFXuHrhsfw9bduEtPbVMqRNogA5SNQGUgfDxpHt/svxeaGvWQk+93yY65co18M3rWpx/ENprYx9t+zVvFW2xlu4cyWmeVJdbiqrMoUA6HxHXY1yhBIBkx9a7Jx67Y4dw02cxj2TWbYMFnZgRJ5bksdIGvgK4mb9M0hbHTg/ahMFaKWED3X1uXH0VfuoijVlHUkazyoVxPj1/EkG9cLgbDQAeOVQBPjvS+L9ePiwoo2Av3MQFHjQzEYosY+NVb2KJNaC5G2/XpQkxootCBGxYf8AL5eNb+0oetyK99vSUUDISLkE93f/ABVyze1n9eArKyuWRaJKNAWJ21NCBjDPuiOmv51lZWhFAk2WLfEo+z8G/MVOOM9VI9ZrysppQRlNkbuSAyghDMTp5/OqNzCHlt8x4VlZWWujSMw+GOaFAB6nT60btYEAAk5j1jbyI1rKykyNjQSJ1QrsxHqfxrRsRc5hT51lZUyrIw7MYyKPh8xz3qsllC5MxGkbAdK8rKeLdE3FWWRbXrWzWlNe1lKxwdjYQTvO1ASkEkxHz9KysrpxdHPkNnYRJmY0A09TXlsqddAf18taysqvgki6iW2kQJ9fjvUdzCryr2sqSeylKiq2G8alM90RqBFZWU4EX7NsLqdT9PKq19WJmKyspY9mkQsD0Na5orKyrWSaLXC+L3cPcFyzca2/VTv4EHRhrsQaNP274kTJxb+i2h8lQDlXlZRMBeIcVu3n9pduPcfbM7Ex4DkB4DSqftjXtZWAY2J0qu94mvayiY0D1gesrKAxmevM9ZWVjH//2Q==';

function ProgramDetailPage({navigation, route}: ProgramDetailPageProps) {
  const {programId, programTitle, isBookmarked} = route.params;
  const [program, setProgram] = useState<Program>();
  const [episodeList, setEpisodeList] = useState<Episode[]>([]);
  const [schedule, setSchedule] = useState<string>('');
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [bookmarkId, setBookmarkId] = useState(-1);
  const myId = useSelector((state: RootState) => state.user.userId);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const episodeSet = async () => {
    try {
      await customAxios
        .get(`/api/episode/{program-id}?program-id=${programId}`, {
          headers: {Authorization: `Bearer ${accessToken}`},
        })
        .then(response => {
          console.log(response.data.data);
          setEpisodeList(response.data.data);
          setProgram(response.data.data.program);
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  };

  useEffect(() => {
    episodeSet();
    bookmarkSet();
    console.log(programId);
  }, []);

  useEffect(() => {
    if (episodeList.length == 0) {
      setSchedule('회차 정보가 없습니다.');
    } else {
      setProgram(episodeList[episodeList.length - 1].program);
      setSchedule(episodeList[episodeList.length - 1].startTime);
    }
  }, [episodeList]);

  useEffect(() => {
    bookmarkSet();
  }, [bookmarked]);

  const bookmarkSet = async () => {
    if (bookmarked) {
      let bookmarkList;
      try {
        await customAxios
          .get(`/api/bookmark/`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            const bl = JSON.stringify(response.data.data);
            bookmarkList = JSON.parse(bl);
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
        console.log('bookmarkSetfail');
      }
      setBookmarkId(
        bookmarkList.filter(item => item.programId == programId)[0].id,
      );
    } else setBookmarkId(-1);
  };

  const handleBookmarkPress = async () => {
    if (!bookmarked) {
      try {
        await customAxios
          .post(
            `/api/bookmark/`,
            {
              memberId: myId,
              programId: programId,
            },
            {
              headers: {Authorization: `Bearer ${accessToken}`},
            },
          )
          .then(response => {
            console.log(response.data);
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
      }
    } else {
      try {
        await customAxios
          .delete(`/api/bookmark/{bookmark-id}?bookmark-id=${bookmarkId}`, {
            headers: {Authorization: `Bearer ${accessToken}`},
          })
          .then(response => {
            console.log(response.data);
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
      }
    }
    setBookmarked(!bookmarked);
  };

  const toArticles = () => {
    navigation.navigate('Articles', {programId, programTitle});
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: imageUrl}} style={styles.image} />
      <View style={styles.nameContainer}>
        <View>
          <Text style={styles.name}>{programTitle}</Text>
        </View>
        <TouchableOpacity onPress={handleBookmarkPress}>
          <FontAwesomeIcon
            icon={faStar}
            size={36}
            style={bookmarked ? styles.bookmarkStar : styles.unBookmarkStar}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toArticles}>
        <Text style={styles.button}>게시판</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.button}>실시간 채팅</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginRight: 5,
    paddingTop: 10,
    color: 'black',
  },
  nameContainer: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schedule: {
    fontSize: 18,
    marginBottom: 16,
    color: 'black',
  },
  bookmarkStar: {
    color: '#ffd700',
  },
  unBookmarkStar: {
    color: '#d3d3d3',
  },

  button: {
    backgroundColor: '#4E5BF6',
    width: 300,
    height: 55,
    borderRadius: 46,
    fontSize: 18,
    color: '#fff',
    margin: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookmarkButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 16,
  },
  bookmarkButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ProgramDetailPage;
