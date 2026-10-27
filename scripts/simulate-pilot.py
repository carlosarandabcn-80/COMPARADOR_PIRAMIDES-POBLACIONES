"""Ensayo de análisis con datos enteramente sintéticos; Python 3 estándar."""
from pathlib import Path
import argparse, hashlib, html, json, math, random, statistics

SEED=20261027
SCENARIOS=[('neutral',0,4),('supuesto_mas_2',2,4),('perdidas_altas',0,14)]
def mean(xs):return statistics.mean(xs) if xs else None
def wilson(k,n):
    if n==0:return None
    z=1.959963984540054;p=k/n;den=1+z*z/n
    centre=(p+z*z/(2*n))/den
    half=z*math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den
    return [centre-half,centre+half]
def quantile(xs,p):
    xs=sorted(xs);i=(len(xs)-1)*p;low=math.floor(i);high=math.ceil(i)
    return xs[low]+(xs[high]-xs[low])*(i-low)
def bootstrap_difference(a,b,seed=SEED,iterations=5000):
    if len(a)<2 or len(b)<2:return None
    r=random.Random(seed);diffs=[]
    for _ in range(iterations):diffs.append(mean(r.choices(a,k=len(a)))-mean(r.choices(b,k=len(b))))
    return [quantile(diffs,.025),quantile(diffs,.975)]
def generate():
    r=random.Random(SEED);groups=['laboratorio']*20+['comparacion']*20;r.shuffle(groups)
    bases=[]
    for i,group in enumerate(groups):
        pre=r.randint(5,14);noise=r.choice([-2,-1,0,0,1,2]);practice=2
        bases.append({'id':f'SIM-{i+1:03d}','group':group,'form':'AB' if i%2==0 else 'BA','pre_transfer':pre,'noise':noise,'practice':practice,'tasks':[{'id':f'T{j+1}','seconds':r.randint(25,180),'outcome':r.choices(['alone','help','not_completed'],weights=[7,2,1])[0]} for j in range(6)]})
    dropout_order=list(range(40));r.shuffle(dropout_order);scenarios=[]
    for name,delta,dropouts in SCENARIOS:
        records=[]
        for i,b in enumerate(bases):
            missing=i in dropout_order[:dropouts]
            post=None if missing else max(0,min(20,b['pre_transfer']+b['practice']+b['noise']+(delta if b['group']=='laboratorio' else 0)))
            records.append({'synthetic':True,'id':b['id'],'group':b['group'],'form':b['form'],'pre_transfer':b['pre_transfer'],'post_transfer':post,'status':'simulated_dropout' if missing else 'simulated_complete','tasks':[] if missing else b['tasks']})
        scenarios.append({'id':name,'synthetic':True,'assumed_extra_points_lab':delta,'fixed_dropouts':dropouts,'records':records})
    return {'synthetic':True,'warning':'DATOS SINTÉTICOS. Ninguna persona participó. No demuestran eficacia, usabilidad ni accesibilidad.','version':'2.0.1','seed':SEED,'generator':'Python random.Random, semilla fija; grupos 20/20 barajados; pre entero uniforme 5..14; práctica común +2; ruido discreto [-2,-1,0,0,1,2]; truncamiento 0..20; pérdidas por orden aleatorio fijo independiente del resultado.','scenarios':scenarios}
def validate(records):
    ids=set()
    for row in records:
        if row.get('synthetic') is not True:raise ValueError('Cada fila debe identificarse como sintética')
        if row['id'] in ids:raise ValueError('Identificador duplicado')
        ids.add(row['id'])
        if row['group'] not in ['laboratorio','comparacion']:raise ValueError('Grupo inválido')
        if not isinstance(row['pre_transfer'],int) or not 0<=row['pre_transfer']<=20:raise ValueError('Pre fuera de rango')
        post=row['post_transfer']
        if post is not None and (not isinstance(post,int) or not 0<=post<=20):raise ValueError('Post fuera de rango')
        if (post is None)!=(row['status']=='simulated_dropout'):raise ValueError('Ausencia y estado incoherentes')
def analyse(scenario):
    records=scenario['records'];validate(records);groups={};changes={}
    for group in ['laboratorio','comparacion']:
        full=[x for x in records if x['group']==group];complete=[x for x in full if x['post_transfer'] is not None]
        changes[group]=[x['post_transfer']-x['pre_transfer'] for x in complete]
        groups[group]={'assigned':len(full),'complete':len(complete),'dropouts':len(full)-len(complete),'completion':len(complete)/len(full) if full else None,'completion_wilson95':wilson(len(complete),len(full)),'pre_all_mean':mean([x['pre_transfer'] for x in full]),'pre_complete_mean':mean([x['pre_transfer'] for x in complete]),'post_complete_mean':mean([x['post_transfer'] for x in complete]),'change_complete_mean':mean(changes[group]),'tasks_alone':sum(t['outcome']=='alone' for x in complete for t in x['tasks']),'tasks_observed':sum(len(x['tasks']) for x in complete)}
    a,b=changes['laboratorio'],changes['comparacion']
    return {'id':scenario['id'],'synthetic':True,'assumed_extra_points_lab':scenario['assumed_extra_points_lab'],'groups':groups,'difference_in_mean_changes':mean(a)-mean(b) if a and b else None,'bootstrap_percentile95':bootstrap_difference(a,b),'bootstrap_iterations':5000,'missing_policy':'Casos completos emparejados; ausente se conserva null; no se imputa cero. Diferencia laboratorio menos comparación.','interpretation':'Resultado del mecanismo generador elegido; no es un efecto educativo observado. El escenario con +2 introduce esa ventaja por construcción.'}
def self_test():
    payload=generate();assert payload==generate();count=0
    for s in payload['scenarios']:
        validate(s['records']);a=analyse(s);assert sum(v['assigned'] for v in a['groups'].values())==40;assert sum(v['complete'] for v in a['groups'].values())==40-s['fixed_dropouts'];count+=2
    assert bootstrap_difference([0]*5,[0]*5)==[0,0];count+=1
    assert wilson(0,0) is None;count+=1
    assert analyse({'id':'empty','assumed_extra_points_lab':0,'records':[]})['difference_in_mean_changes'] is None;count+=1
    base=payload['scenarios'][0]['records']
    for mutate in ['duplicate','out_of_range','wrong_missing','not_synthetic']:
        rows=json.loads(json.dumps(base))
        if mutate=='duplicate':rows.append(rows[0])
        elif mutate=='out_of_range':rows[0]['pre_transfer']=21
        elif mutate=='wrong_missing':rows[0]['post_transfer']=None;rows[0]['status']='simulated_complete'
        else:rows[0]['synthetic']=False
        try:validate(rows)
        except ValueError:count+=1
        else:raise AssertionError(mutate)
    return count
def render(payload,analyses):
    f=lambda x:'N/D' if x is None else f'{x:.2f}'.replace('.',',')
    panels=[]
    for s in analyses:
        rows=''.join('<tr><th scope="row">'+g+'</th>'+''.join('<td>'+html.escape(f(v[k]))+'</td>' for k in ['assigned','complete','pre_complete_mean','post_complete_mean','change_complete_mean'])+'</tr>' for g,v in s['groups'].items())
        ci=s['bootstrap_percentile95']
        panels.append(f'<section id="{s["id"]}"><h2>Escenario {s["id"]}</h2><p>Ventaja adicional del laboratorio introducida por el generador: {s["assumed_extra_points_lab"]} puntos.</p><div class="scroll" tabindex="0" role="region" aria-label="Resumen del escenario {s["id"]}"><table><caption>Puntuación sintética de transferencia: 0 a 20</caption><thead><tr><th>Grupo ficticio</th><th>Asignados</th><th>Completos</th><th>Pre emparejado</th><th>Post</th><th>Cambio</th></tr></thead><tbody>{rows}</tbody></table></div><p>Diferencia de cambios: <b>{f(s["difference_in_mean_changes"])}</b> puntos; intervalo bootstrap percentil 95 %: {f(ci[0])} a {f(ci[1])}. Es incertidumbre calculada dentro de una simulación, sin evidencia sobre personas.</p></section>')
    return '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Piloto simulado DemoLab - datos sintéticos</title><style>body{font:18px/1.65 Arial;color:#172d31;max-width:1000px;margin:35px auto;padding:0 22px}h1{font-size:2rem}.warning{border:3px solid #8e350e;padding:20px;background:#fff0df}section{border-top:1px solid #657d76;margin-top:35px}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:16px}td,th{padding:12px;border:1px solid #657d76;text-align:left}th{background:#e9f3ef}a{color:#0d514a}*:focus-visible{outline:3px solid #8e350e;outline-offset:3px}</style><h1>Ensayo del piloto con datos sintéticos</h1><p class="warning"><b>SIMULACIÓN. No participaron estudiantes ni docentes.</b> Estos resultados comprueban un procedimiento de análisis. No demuestran aprendizaje, satisfacción o eficacia de DemoLab.</p><p>Semilla 20261027; 40 registros ficticios, dos grupos de 20. Tres escenarios reutilizan la misma base aleatoria para aislar cambios de supuestos. No son tres cohortes independientes.</p>'+''.join(panels)+'<h2>Reproducibilidad</h2><p>Se entregan datos completos en datos_sinteticos.json y resultados en resultados_simulados.json. El generador y las autocomprobaciones están en scripts/simulate-pilot.py del código. Ausencias se conservan como null y nunca equivalen a cero. No hay valores p ni conclusiones causales sobre personas.</p><h2>Límites del ensayo</h2><p>La simulación no prueba comprensión de preguntas, carga real, fiabilidad de correctores, participación voluntaria, acceso con tecnologías de apoyo ni captación. Sus intervalos dependen de supuestos arbitrarios y pérdidas artificiales. Los tiempos de tarea y éxitos se generan aleatoriamente y no son medidas de uso de la aplicación.</p></html>'
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('output',type=Path,nargs='?');parser.add_argument('--self-test',action='store_true');args=parser.parse_args()
    if args.self_test:print(json.dumps({'selfTestsPassed':self_test()}))
    if args.output:
        args.output.mkdir(parents=True,exist_ok=True);payload=generate();results={'synthetic':True,'warning':payload['warning'],'seed':SEED,'analyses':[analyse(s) for s in payload['scenarios']]}
        for name,value in [('datos_sinteticos.json',payload),('resultados_simulados.json',results)]:
            (args.output/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
        (args.output/'informe_simulado.html').write_text(render(payload,results['analyses']),encoding='utf-8')
        print(json.dumps(results,ensure_ascii=False,indent=2))
