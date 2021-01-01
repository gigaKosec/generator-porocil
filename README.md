# generator-porocil

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


BUGS:
- radio buttoni za izbiro lokacije so kakor da vsi v eni grupi (čeprav je output v data ob izbiri pravilen)

TODO:
- datumi za dneve
- različni izpisi (tedenski/mesečni)
- sprotno shranjevanje

- premakni dnevni row v svojo komponento
- dnevniForm preimenovat v Tedenski?
- ? data iz dnevniForm premaknit v app.vue?


TODO MINOR
- default Lokacija settings = od doma (se ne vidi v obrazcu samem, četudi v dati)
- obvestilo uporabniku, da shranjenje delovalo
- lokacija raje le DeloOdDoma checked/unchecked?
- bližnjice na tipkovnici
  - ctrl-v prilepi iz pravkar izpolnjenega textarea v naslednjega
  - tabi preskakujejo le med textarea??

TODO DATES
- datumi, ki keyi, spremenit v ISO
- vsem datumom odrezati ure?  (vse v ISO - toda potem ne moreš delati z njimi)
  - T: ker izbrani s pickerjem, so že po defaultu 00:00:00  (le gmt = +1:00)
- chosen date - če izbran po defaultu, odreži ure!!!


