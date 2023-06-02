import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet, Alert,} from 'react-native';
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

const program = {
  name: '',
  broadcast: 'tvn',
  imageUrl:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUWFRgVFRYZGBgaGBoYGBgYGBgZGBkYGRgaGRwaGhocIS4lHB4rHxoYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHjQrISs0NDQ0MTQ0NDQ0NDQ0NDQ0NDE0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAEAAECBQYDB//EAD4QAAIBAgQDBwEGBQMDBQEAAAECEQADBBIhMQVBUQYTImFxgZGhMkKxwdHwFFJiguEjkvEzosIHFURysiT/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAiEQACAgMBAAIDAQEAAAAAAAAAAQIRAxIhMTJBEyJRcQT/2gAMAwEAAhEDEQA/APVctILU8tLLWlmdHNlqBrqy1ycRTRLImokVGTTkmqERNQmpE1A0EjGmIqVKqCiEU4FPSilYUOtPSC09IdCpUqagBGmpE1EmgCU02aok001QEs1ImozSmgCU0000000CHmlNNSoAU04qNSWgBxSpUqAFUqaaU0AOKeozT0ANNSmmp6kBVE1KomgCzL0xaorXSKzNSOtIpT0xNAEWQVxeujtXBmNUiWRY1CanlNNFUTRCaepRTZqAobLTgU2amLUDOgpE1yzUs1AE5piajmppoFY5NMabNUS1AD0qaayPbnj1zDhEtOFZpzRBcARBAO09fKqGlZriaVeG43jN+7/1LruOhYx6wNK64XjWIQgrdcRoPGxEehMVOyHoz22lWC4H23fMFxIBU6B1EEebDYj0rdo4YBlIIIkEbEHnRdicWvSVKaVNVCHqQqIroBQA1KueKxKW0LuwVRqSTArHYztyCSLCBlH3mmT/AGiI+altL0cYuXhtGpqwTdvH0AsL5nO2voI/M1oOC9pEvwrLkc7ayp9DpB8jS3iV+OVXRe1IU0U4pkCFOKQpwaAoeok0166FEn6b1WX8QJ2Ouu3+aTkkNRs0wpF65n1ptKmirJM9MSabMOVRZ6YrHK9aiSKizVAmnQrJM9c2amNKmKyJalNMaagB5pppU1ADzSmmpiedUA9Kg04nYL5Betl9sodSZ9JoypAiaanNRNUBHE3CqMw1yqxA9ATXjGGw9zEu7s0tuSebH8v8V7YBXmaWThb9y0FUDOzLJ8RQ/Yyr0AI1rLI6Vm2CKcqZVW+zF5/soTynYTPnyiq7ifDLlkw6MqzAYgx87TW4x2Duh0HjdWg5c7IgHmF3NaW1gle0UdAUIgqSXHpJ1rnWRnVLGjxq3crf9gOLsWOHYyCpZJ+6RuPTn7edZY8BdsTcs2xK23Ms2yqdVnqY+Yq/7NcKexjrYJkFLhmI1CcxJ/mEa9elaxmtkjGcHTdcPRaVKlWxyjrUxTLTu0KSBJAJjrA2oA824/inxuMawCe6tMVgbFl0Zj5zI9B61fJwpEtFEQDSNqy/AXyOId+8c5rismjMx8UNE6E9avsfxV7T5WupbGk50LCTzJkQNq5pytndCNLhmLuFDK2kFdD5EEiumGuACRvz86suN4RkP8QMpt3BlcoZUMdnHQHTr9ay4xORyreh/L2rNdNm16eq9m+Ji7bIJ8SQD1IO3voRVjcxIWfLcDpXnPZPiaW75zuFDLA82zLAAHOJ+tawYpTO/Qgggjzg7/5rV5aicksa2dFs+KzKCPj3GlBpxIg6gETpOgH7kfNAYe8ZO+kb7H676VG3mOjQZMaagmP1isZZ2/8ARxxoMxPEGLSAAp1/Z+eVQOMU6nU9dD9aqcZhTIRWKmCcxMjeY/HXz51UXWvgkANE6RtHxUrJJ/Y3BI9cK1Bq6lKYqK7bOajiaY11y0xWnYUcjUCK6kVFqdio5EUxqRqv4vxS3h0Ny4YGygfaZuSqP3FMKCzTV5ljO3WJYnJkQToAuYx0Jbf2ApuHdt8Qh/1YuLroYVh6EDl6UBqz06mNVHBe0VjEiEYK/NGIDe383tVsaAA+K8RTD22uudF2HNmOyjzNeX8S4pfxRLuxCT4UB8CjU6DmY5nWrz/1Iulrlizrlyu7AAtrIUGBrpqPc1VvgHSyjafbGpOUEZVWZPLT8aiU6dG2LHasob2FcAEa7Hz5/pVvgOPYqyQReZlX7rnOpHIa6gehFcsRYdVYOsSoKMDKkgloB6mdKpLWJI0O0gfWlGdlShR7XwfiS4i0txdDsy/ytzHpR1ee9h8bkvC3PhuKYHLMoJB+hHvXoVaJnPJUyaVlO0jol5nZZKhBHUAT+ZrVLWd7XYRtLiaSAhO4BGqn3Ej2FZ5fibYGlLox4i11A62ysHmQQy9RGtXGCclQYis1wnBM6kO7/wC6B9KuFxJTRj/muNs75L6Rzx+ERXc6A3sofSZCDL8wa4dnrQe67gkrZBsKTuXJV3J9AEUerVYh84zHlQHY206JfR0ZT/E3GBOzq4Uhh7RWuFJyswzyahRoqcClUlrrOESioYtyqOw3CsR6xXWndQQQdiI+dKTGvTIYPFWEcM+gXWYnX2ou8LVy6SQrTEHcEVn8Tbe3cIzQoJAhQxzTuZ3FGhLpYM+QCNCoKk9JExXG2z0dVVmnPD7JRkyKEYQygQPgc6894r2SOc5H8EgKSCW9ARuZ2Fb3D3Bl1PKqbi3EURVz22di5CIp1JAkn4jXkTU274NJffhmcBwHu7njvsikQroGTNMjKWP2GzaZdfcVohYIUB3L6mGYAN5gkaHl0prKtDd5BZizMonKoMnKP5oOk85NMmKCINRGsAnWJEHfp+FRKTaMZVbo7YMgghh5SPLTf9ak65IAMZtid58uvOgLuMEoRoM4GukyJkxvypr3EVDr4xlQQTGsz71FCTLS640neDG3v7UNcidBE6kZefPlQL4rMQjOqkgMJlftDqRrypSNnQEjTSSIHn9feigPTopGmZqjNeicxKok1FjXNjTCx2aubNTNUDVJE2OTXnXbTDXb2JbfJaVVRf5mcKzn6j/aK9DFYc4x2vXhq8OxEqBABgQRusR51M5ao0xR2ZhcThHRiChjXWOQjX60Gtxfj9K9E4fxTvGKMlphscr+Mf2ka/NUHbPhgRluIqhDIIAiDJb43qI5O0zWWKlaKG3cEggkEaggwQZJkHyr1vsxxFr2GR31cSjHqVMT6kQfc14ywI5aDcxoJ2k8q9c7GYNreEth9GeXI6B/s/8AaFPvWsXZhNUgXH3F/iLzsmZgbaLprkCI8Cf6rj0XdCXUAZCFP3WEERyrjx7Ah3GUwxAY6kajwzp5AfFCi26RmcsIgKYOX0O5965sjqTOzCk4ILPD8OqFcgg79PjlXlXFcOq3XVPshjE9K3/FeKKiETrFef4vEZzMQPrRjtsWWki04VjMjo4+46H1gyR+VeyqwIBGoIkHqDtXhOFOsfvUV6/2SxXeYVCd1BQ/26D/ALYrpizkmuWXIpr9pXRkcSrCD+o8xv7VJakKbIToyXFOHX8OudHzpMExDLOgkcxyn6Vz4fbZ/Gx18612Jth0dW2KMD8GsZwlLjv3YBBX7R5KOv6da5cuPv6o7sOW09n4XvBbTOxH3B9o/gB51dY24qsiKNWkACIVFBMny2FNYVLaBRoAP+SfOgOHFnuNebZ9EH8qLt8nWtsWNRXTnzZHJpIPuIV3FDvi0WcxiBr77D1o27dgxO+00DxXg6XdUbI2h6oY5EcvUfWqlslwhJX0B/8AcXlV+T87fvlU7eKMFWJmNPKs09u7acWroYGSymdCI+0D94b/ADrVlhDmaZBIGo5GY2rjnkkmbRiqJ4ktIdcpJ3B+lBXuJktkCEkdNvmrFOhGp6co5/WuOTxqgkkgcumk1Mf24zWMtQzh2HLModlUtsv3jGpAHPT1qHH+HSytZUuVBBhhI1BiOU7+1EXLbFcmHIdysd4xOS0TMsI+0YiFG/UDUdMFhXR0DKXKgTcWBnIESyjZj8Vt+NVQpTv0zWJxDZBmUhgQCpABWRpIMfs1XPhWdmGgKggyDoSRudto/wA16Pxbh1vEobbaPEoYhlPXzXr615tfVkzZiyPZYh1c+BtCdD/NEEelYyxuPhCaZPDZxKMJEfe5ZSIj5/CuT4JGDQNvtEkkEzJGkToRryoQ49bjlyWVcviAiToNOu43rrgHZnJXwqqk5dpeIgzqxkzU010doJurZdPGjCAEDKSxU7KSB7b9KGxDXlIBIJjcAwd9dqLN8WyEeNmB880EH03rquIUKoK5vCIMLty31pdQOj1Gos9czUCa9Gjmsmz1AtUSaiTTEOTUTTZqWamI54piEcruEYj1ANZPCcUtKMpUh36KSI5CRWwBrCtgGW64QaZ21zssctMpHSfescqOr/nrqLDBrYknJDTMHr1A2FNxnAJiFRGMBXDGOYAMj3quvLkkZixmZY60RhbueF361zW74dTSJJwlbjGwyqqMDAGhFsSp0BjWRrHNZ2rWPA8gPoKC4TwkWS7nV7hHL7CKAAg98xPm3lXDtZdK4W4V0JASegdlQ6jYQTXXjjrE4c095c8PMO0PaK4+Ke5achYCKORRSYJHmST71ZcKxNy+gYvrJDeoP6RWPxCwxEzH41oOyOLylkPMhh67VlkVqzXFLV0GccwOS0W1J0+p1rKOdjXqCYcXvAR4d29OnvtRGH4Bh1fvO7UsNpURPptTxJsWaSTPLbT6yK9O/wDTy4DauCfvgx0lQPyo7inCrGIQI6BY+w6QrIY5GIjyIIrKdisabGKfDPpmJQ8hnQnKR0kT/uFbVTMb2iz0xadnCiSYFc+8CgkmAKq8W5eWO33R0/zWiVmYPxXiRhjMIozEDcga6/G1UXCu0l23fIvhAjuLZCiBb/kYGJK66z/NOkRRvGLeWwdDq9uY1JHeJm+k0Dwlbb4l2bUd4wAO0gAAx7H5rXVak7NM1nG3OQWwYa44SeimS5Ef0BtaPssMwAEACPYCKpUt58RvKWkyqOjOdY8gqgf3GrXDt4j6VDVKik7bYpObUzAgV27yNJoZG1J8/wAKbPrNKhhePwaYi2UfmPC3NGiMw/etebYC7etX3tXJLoMh3Inl/bEEeRFej27sCazHaDBMcYSFOW4iOznRQVlIn0VdB1rmzQtcXTSMq9Oy3Q2WNZXlH3d5rlhcULj+AggsyZhr4UPjj+7w0FxWyMPZVFaXvOqZjpCE5mA6eGdd/gRa8MsqgiACAFCiBlXkDG06mKzx4tffTRy5ZdWLhiBoBoPPqf350RbvKKo2xkmPujf+o9B5f4o3D9TufoOldWqRz7Nstc6tAYGDsdoPKDuD51nO0GHt3HyvGdMpcEf9RGBUNpsw8Xx7VfIZEGsp2vXLcW8D4u6ggc8rg/8AlWGb4msH0yHEOEm25IJIBIkJrJgjY6afMVLh5ZXhxrImREHMTr6aVZYnHKylkOoAJ211J2PoPk0H/FS3eEZQ7wRqepGvL/Nc1tqmX4WWHtZ2LsuYaqisJPhYKSfcHziK48RKI8CNgTObfbp5VYYzFlECqnitzmJIBlyDAEg7SZ13qpxHeA5LpUsoC6sZA3A2861UeEN9PTjcqJuUKbtRN2ukzCjcqBehjcqPeUxBWemz0N3lcr+LC+Z6U10T4dMXxWza/wCpcRCdgzDMekLufYVnOJY6xeDPYLhszAkSuYoJc5GE7emtYpsNic7ogCDPcl1UB2BfMCX+1MxEEVfcEwv8OhZ2LEZnYk7GNQP3vRrtxopS1dpnBLTMYZiTyjWa1vZ7AhIZzqNl6eZ8/KqHsnxG3dLqVCXgWJQT9ifuz02IFX2IaBCmDpz213+hrOOFLrNsmdtUlR1xvaSwl1EdwpZiM33ApGmZtlOx1/CuvaJ0bDXQYYZAfI+JSI8tqxPDsC73XGIYumfOiEDxsWJ8R5KNPDsdOQir7jLt/DugOrDYco8QUe4FbanPsr4eVOxJLHckk+pM1adnbZa4SNgNfSqhToKvuzV/LmhfFM5p0IgeEiNpG/mawq+HQpKPWb+y3doiD7TnM3XKok/kPei0vax0An1NVluXAvNoXRVVR91ScxPqdPgVPDv4m83J9h4fy+taRVIwm7kWisD9oVgO2ts28Ql5DDEAz/WhGVvWCn+2tyr1jO3JkKf5TPsdP0qpdQoumbbB8QF+3af+dQzAbZiIj5Bou8NKoOAW2TD20I8SKD0mTn+RP0q6v3NARsapeIKK7tDdKYdmG6lD/wB61kOCYrI4JOmYH9TWp7T64Z46Kfh1NYazvp+41raPUZT4z0fs+7G21xjJuOzjyE5QPgT71Z2bkN6zVTwZ4sWx/Qs+4Bop7kQfOspO2aRVJE2vkTryke5NOtwxPwPzoK9cBcHSACInnIgfVqIR+fxQUEm9A9N6Bx3EMxzNqFExMAAayT05mhsbiPEqDzLH05fX6UDxiSndKYa4QrHorGI+J9gaVEtgVjH3cQUvOFgPFk5YKqzhc5UkgtExI0+tX1+6EVsvWJPNm5k8+WtB2rKoA3JFyovJQBExzblP6meeJJLJbGpguw89vzpUhNthmAGzch9gHc/1HzP51eYdutVFpMmpljRtq4xqZMqKLhHrGduXm5ZSYlWJ6xmX9DWqS5pWJ7b2He8jJuEVROglnNY5Piax9M/bA74IsxqrSZOUa9PSi8ZiFRcsahgJgQDGvSdCPg1TpedLmb7wJJ8jqNx612Z8zeLVftRAnST+dczj00sPxHFrlx87EABAhgwXQDYk7bGPXzqS4jNLZgJPPehXRTIA2SWHQ6+XoY1qOAdMplo10Gm0Dy6zVbWGqPSu+pu+qu76l31dRiWPe03e1X99S76mIOfEQCarnvTM78/fn+NccfiYAGu8/FV17FEa/uKuJMg12CgkDYaeuwoDiTxbb+lGJ8yY/MVBMVnIUHTQn6/oPmgO0F//AEX1jMVX2mT9AR71TYkugHZxf9TMCSygHPyzARlXyjTzHICtph7zMWZokldtgIIgfvmaxHZu6A/i6BQo2QE6A+Z3P110GrtXYLj0NJeDl6FvAPqY0361yxbSpPn8D9/kOVD43ERlPUx+IoLieKIQgHKI15n1bpTsmjF4y3ld15ZiR6HWrrs8kpmAnUgis/ir+dif3FX3ZgkKT1OlYp/sbSX60a3B3TkAO4MabaGNPcH5p7F/xuOhj5JNC2LmnsK5Jci6465SPcEfiDVrwzfped7VLxPAHEOE2XQueigyR6nb38qNW7RVlco8zqf0p2CRYIBA6gR7Vy7zwQdwSP0+kVAXaEv34cjqAw9tD/4/NCZVEuOXgbDidch09qwSXokjmI/3aH6TWvxOID2mB3gisQ6xAJB8TbGdFJUfOtaxdIzkrZv+F4r/AEkg/dUfAAqzuXNBWW4Hd/0gOhb8Sfzo/EPEOPcVD9LiF2Wm75RPvMVZNcgVVYR5lx97QeQE/nSvYk86VjIm7N0tyVfz0/CuGKxQzg7sozf3v4F+k0LcvgaA6s0D+0E/l9aq1xc3YO5dB7BG/Omn1szf8NO94aAnQan2/YoK0t52Z1bIDABGWTuY15ULibgY5JIB1YruFHSisMfD/psHQgAod9PLr5ipvg/sPsYjEroYcf8A1hqsbd9zq8IPg/FVFiyDuHQeTmPrXRrmHTR3Wf6m1/GobLii9THKdBr51nu06zcQ6aZT5x4p/L4Ndm4giwEYMDB01gUPxtgwVuoj4k/pWOX4mkfTO45CpZzEMYMDQ7mRStWPsajWCSNwPfrNTd86DMQDnkHUiCTz6biutxYdADKzyjkNB6c/esVfhbOmOugOASp2VvaI5+Z+BWexTw7bjWYyzv50ZxF2DEmCCTGvKY9ttqrsUpZs0TPOfM00gbN8L9LvqrRepd9XSYll31Lvqre+p++oGEYq7rrqsa+R60Nc9fSdQR0rgb+pP6aVxvYlQOcTsOX+K0TM6B7OKyXHU6AiVn11HyaH7Q4iUQT96R08IOp8hmn4rvg7Wd2d1AABCx1I3nyH41T8bkMqtyB95IiPWPpQ5WVGJ04U5GYjTaD94mTr+/1o7/VnMLra89NRGkiI/wCKq+HOYaNyR6bbCj7GIgFWkjmOYHUfpTXgn6W+Dvk/bGZhsRpJ/m8jFB9ocQe7KIp11aDoANTJ5nyqeBbwkyTJ0IB2j6UsWEIAYKY1AIn6Un/BLjsylq2THQ8602BbKg8gfpr+dAYiMyHlqPk6flROchdBoJE//YAVm1RopWWti94iPKme5F0Hqn4Np/8Aqq63fhgZ5VxuYwtm8xKe3L99aJS1HCGzNNbYkaa0YlxvvR+dZrC48lQVMctvfUc6tBjlIGoE0ozsqWPUsjfjnVLxXiaIcpcBwZA1nKdDP4+1drt/nWax1gMjvu7MXJ5+Q9ANKpyolRstU4ihWA6kk7Zht6TVRxK4HuSgCgKoMaKWA1IHLl8VSTTrcI2q1IlxNfwS9Csp5NPyB+lW129IisRgOKsh1UMOhJU/I/Stf2Xxq4m+lm2hDsZIYFkCLBZmI2UDrEyBuRQ5L0FFoP4WLjOttAPFoFZlWTGgGY7moYy/BKkQykgjTQgwRRIv2hjkW2CqribaqrTmAzqIM6jrB11oHj+FvJduM9p1ttfdQ7Iyr4nYggx4hEnTpS26JrhSYjFHvrU7DMD6v/wvzRS8Odv/AOlDmS2+W5qga3JhSVnNlYzDR1q8v3LFrE2lv/wZEW7hRMFdZ2RgGGrLCMVjpHlUuDYMm3jyz20VzaKFs6oEF92WdCQCDoINGwKJUWboGrKyyZzRIjzjYetC4kG2wuJqu5A2q34RgrZxPcs630yO6BHdc7qmZbSuQramRprpXfF2D/D3br2Ew5R0CMq3ES6HLB0a2xMMoAJcbzrScgURYm0qKHuAhWQOpDh0ZDMMrKSI0NDWAjkgIAIB11LTrrS467LawpUCP4aMoIKkG7cH+aJ4dhba2hiLzOElbKImXOz5S5JZpCqFjkZmpKILgRmGQgSQNSABPUnQCufHHey6WXWGlgRoY8KkHQ67g1YcSsoiJctsxt3A+UPAdWQwytGh3EEdaE7XIj8QhrqWhbtW3DOrOpYokLCg7hTyjSOdRPqHH0z/AHTeKV1HiAjluNue+lGYfP3f8R3alEKq7KwDIzHKmdZmGMqDEE6b1peK4dUVbhy2HHiR7eFxNvO4XQZ3ICdR4dKG7S2WI4sVEEvhfQ5cQhnpOn4VC4XRhb90GYGXQmJ2Mg+3OmXUA9RPOh2QgMWBmdZ51yFwDT9aANOLtLvaDD0s9bGYb3tQuYiBQueoNc8XtQgYSMT+9DXF70sBpqYmNRXF4qOEeSSTqNNvXU+dU2JItVcAQNqz/aC5NxddkHtJaT+FWmeqHi7zcPoo9dJ+NakZPAGVI210HP8A5oxifQ8j+tV+AkzlEmd+XL4qzs2ANWOY/Qe1WnwlroelwwB5cq5XnABgVwd/2DrQz3Z2bX98qLCid7Ue/wClSTESpE9J6b1xL7/NPYRSJO5P5elSFEMRiQqyfQDzof8AigdjHMeR5ig8bclo5ChpqZKzWD1LhMVCvEjSdOTSPirDCYxXGh15zvWaW6wBAO+h8xTK5GoMGs9S9zXvdgEiuSv4CPKqXC49mORtZ5+mtWmfSl0doobiwSOhrmTXfGHxmhzWqdoza6OTVseNlbH8PYTulcDv3zZrt9hrDPAy2wdkA9SxNUwNI0xGs4Px27fxGBt3QHdMVYC3zPfG33iDunb76g6gtJG1C8d4o/8AE4hWOZRiLsAk6RdeNtNPMGqLCYprbpcRiroyujCJVlIIOuh1HOlfvs7s7mWdmZjpqzEsx001JNAHo/ZbtPfxDpZ75kyo7M/doz93aQto2XM7ZRA1oluKW8RhsVcsXrrZRZ74X2R2ZO8ITK6xlIY/ZI22O9eY4TFPadbltmV1OZWUwynqD+5kij+IdocTeTJcueHNnKolu0rP/M4tIuZvNppUM1HDnwjp/rPfVw2gtrbIjcEFmGU0W/ELAP8A8u/oQGxGIXKvoEQtHlnFZbAWA9tWzkNrJUjqYBHWuyyh8csP5uXwKF0l8Lzit0rbwIb7RwgJIAAJ764eXrNTs8Ya2htlEu2mIZkcNAZdnRlIZGgkSDtVLxHEO6pmcsLaBE28KAkhdBrqTvUsPdDpTF9lzxHjDXVQ5VREUqiICEUEydySSTqSTrXbtbiO64k94qG7s4Zwp2bIlt4PvNZ6y+hU8qhxjHPddnuNnYkBiQNcqqo0ED7KxUS8KiaPFcdssl9bffs2IdGfvmTLbyuX8GUksZ0zGNOVXPG8c7jiis7OiPYCKWJVZvKCFGw2rzm0+retd04i6JcRWhLndh108WQ50knUQx5VkWSxBzArHTL61WvhzOu9FpeDflXLQkmTuee3lTXADA9M94KJYgeppUq2IOH/ALhb/nH1/Sulq5mkyI5RrpSpU0Jj3Hp7UAeup8zSpUMES7yg7mEVnLsZnYbco5UqVAM6o4UQAAPIaUzX5/wRSpUxA9/ELzI/A0DdxcyBr0PMfrSpUMEGlxAMilbvoACWAgnSRT0qQIp2aTPWmpUqRQjTTSpUhhGB+2PQ1c5tKVKoZSAsRgnbUR+dV56UqVVEUiDUg1KlVCFSzUqVADzSBpUqAJW7jIcykg9R+9avMFxIOMrwG+jenn5UqVJgFqIECh7RyuQNjqPWlSpolncP4/UVXZ8zGf6vrr+/SnpVMhojbffzp2gj6n2p6VZljYcRpUu8HUfNNSoEf//Z',
  schedule: '일, 저녁 9시',
};

function ProgramDetailPage({navigation, route}: ProgramDetailPageProps) {
  const {programId, isBookmarked} = route.params;
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [bookmarkId, setBookmarkId] = useState(-1);
  const myId = useSelector((state: RootState) => state.user.userId);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const init = async () => {
    try {
      await customAxios
        .get(
          `/api/episode/{program-id}?program-id=1`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        )
        .then(response => {
          const el = JSON.parse(JSON.stringify(response.data.data));
          const lastEpisoid = el[el.length-1];
          program.name = lastEpisoid.program.programTitle;
          program.schedule = lastEpisoid.startTime;
        });
    } catch (error) {
      const errorResponse = (error as AxiosError).response as any;
      console.log(errorResponse?.data.error.code);
      Alert.alert('알림', `${errorResponse?.data.error.code}`);
    }
  }

  useEffect(() => {
    init();
    bookmarkSet();
    console.log(program.schedule);
  },[]);

  useEffect(() => {
    bookmarkSet();
  },[bookmarked]);

  const bookmarkSet = async () => {
    if(bookmarked){
      let bookmarkList;
      try {
        await customAxios
          .get(
            `/api/bookmark/`,
            {
              headers: {Authorization: `Bearer ${accessToken}`},
            },
          )
          .then(response => {
            const bl = JSON.stringify(response.data.data);
            bookmarkList=JSON.parse(bl);
          });
      } catch (error) {
        const errorResponse = (error as AxiosError).response as any;
        console.log(errorResponse?.data.error.code);
        Alert.alert('알림', `${errorResponse?.data.error.code}`);
        console.log("bookmarkSetfail");
      }
      setBookmarkId(bookmarkList.filter((item) => item.programId==programId)[0].id);
    }
    else setBookmarkId(-1);
  }

  const handleBookmarkPress = async () => {
    if(!bookmarked){
      try {
        await customAxios
          .post(
            `/api/bookmark/`,
            {
              memberId: myId,
              programId: programId
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
    }
    else{
      try {
        await customAxios
          .delete(
            `/api/bookmark/{bookmark-id}?bookmark-id=${bookmarkId}`,
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
    }
    setBookmarked(!bookmarked);
  };

  const toArticles = () => {
    navigation.navigate('Articles', {programId});
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: program.imageUrl}} style={styles.image} />
      <View style={styles.nameContainer}>
        <View>
          <Text style={styles.name}>{program.name}</Text>
          <Text style={styles.schedule}>{program.schedule}</Text>
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
        <Text style={styles.button}>{program.name} 게시판</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.button}>{program.name} 실시간 채팅</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
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
    backgroundColor: '#4A3AFF',
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